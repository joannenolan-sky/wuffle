const {
  repoAndOwner,
  Cache
} = require('../../util');

/**
 * This component updates the stored issues based on GitHub events.
 *
 * @param {WebhookEvents} webhookEvents
 * @param {Events} events
 * @param {GithubClient} githubClient
 * @param {Store} store
 */
module.exports = function Status(webhookEvents, events, githubClient, store) {

  // issues /////////////////////

  // one day
  const CACHE_TTL = process.env.NODE_ENV === 'development'
    ? 1000 * 15
    : 1000 * 60 * 60 * 24;

  const cache = new Cache(CACHE_TTL);


  async function fetchStatus(pullRequest) {

    const {
      head,
      repository
    } = pullRequest;

    const {
      sha
    } = head;

    const runs = await cache.get(`${repository.id}/${sha}`, async () => {

      const {
        repo,
        owner
      } = repoAndOwner(pullRequest);

      const github = await githubClient.getOrgScoped(owner);

      const {
        data: result
      } = await github.repos.getCombinedStatusForRef({
        owner,
        repo,
        ref: sha
      });

      return result.state.map(filterStatus);
    });

    return runs;
  }

  events.on('backgroundSync.sync', async (event) => {

    const {
      issue
    } = event;

    if (!issue.pull_request) {
      return;
    }

    const {
      id
    } = issue;

    const status = await fetchStatus(issue);

    await store.updateIssue({
      id,
      status: status
    });

  });

  webhookEvents.on([
    'status'
  ], async ({ payload }) => {
    const {
      status: _status,
      repository
    } = payload;

    const status = filterStatus(_status);

    // invalidate cached PR status
    cache.remove(`${repository.id}/${status.sha}`);

    const issueIds = _status.pull_requests.map(pr => `${ pr.base.repo.id }-${pr.number}`);

    store.updateIssues(issue => {

      if (issueIds.indexOf(issue.id) !== -1) {

        const status = issue.status || [];

        const existingIndex = status.findIndex(run => run.id === status.id);

        const updatedRuns = existingIndex !== -1
          ? [
            ...status.slice(0, existingIndex),
            status,
            ...status.slice(existingIndex + 1)
          ]
          : [
            ...status,
            status
          ];

        return {
          status: updatedRuns
        };
      }
    });
  });

  // periodically clear cache
  setInterval(() => {
    cache.evict();
  }, 1000 * 60);

};


function filterStatus(status) {

  const {
    id,
    sha,
    target_url,
    description,
    context,
    state
  } = status;

  return {
    id,
    sha,
    target_url,
    description,
    context,
    state
  };
}