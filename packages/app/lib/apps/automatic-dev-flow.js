const DONE = 'DONE';
const EXTERNAL_CONTRIBUTION = 'EXTERNAL_CONTRIBUTION';
const IN_PROGRESS = 'IN_PROGRESS';
const IN_REVIEW = 'IN_REVIEW';

const allButClosedLinkTypes = Object.keys(linkTypes).filter(linkType => {
  return linkType !== CLOSES;
}).reduce((filteredLinkTypes, linkType) => {
  filteredLinkTypes[linkType] = linkTypes[linkType];
  return filteredLinkTypes;
}, {});

/**
 * This component implements automatic movement of issues
 * across the board, as long as the user adheres to a specified
 * dev flow.
 *
 * @param {WebhookEvents} webhookEvents
 * @param {GithubIssues} githubIssues
 * @param {Columns} columns
 */
module.exports = function(webhookEvents, githubIssues, columns) {

  webhookEvents.on([
    'issues.closed',
    'pull_request.closed'
  ], async (context) => {

    const {
      pull_request,
      issue
    } = context.payload;
    this.log.info('Issue/PR request closed', context.payload.number)

    const column = columns.getByState(DONE);

      await Promise.all([
          pull_request ? moveReferencedIssues(context, pull_request, columns.getByState(IN_PROGRESS), undefined, allButClosedLinkTypes) : Promise.resolve(),
          githubIssues.moveIssue(context, issue || pull_request, column)
  ]);
  });

  webhookEvents.on('pull_request.ready_for_review', async (context) => {

    const {
      pull_request
    } = context.payload;
    this.log.info('PR request ready_for_review', context.payload.number)

    const state = isExternal(pull_request) ? EXTERNAL_CONTRIBUTION : IN_REVIEW;

    const column = columns.getByState(state);

    await Promise.all([
      githubIssues.moveIssue(context, pull_request, column),
      githubIssues.moveReferencedIssues(context, pull_request, column)
    ]);
  });

  webhookEvents.on([
    'pull_request.opened',
    'pull_request.reopened'
  ], async (context) => {

    const {
      pull_request
    } = context.payload;

    const newState =
      isExternal(pull_request) ? EXTERNAL_CONTRIBUTION : (
        isDraft(pull_request) ? IN_PROGRESS : IN_REVIEW
      );

    const column = columns.getByState(newState);
    this.log.info('PR request opened', context.payload.number, column);

    await Promise.all([
      githubIssues.moveIssue(context, pull_request, column),
      githubIssues.moveReferencedIssues(context, pull_request, column)
    ]);
  });

  webhookEvents.on('pull_request.edited', async (context) => {

    const {
      pull_request
    } = context.payload;

    const column = columns.getIssueColumn(pull_request);
    this.log.info('PR request edited', context.payload.number, columns);

    await githubIssues.moveReferencedIssues(context, pull_request, column);
  });

  webhookEvents.on('create', async (context) => {

    const {
      ref,
      ref_type,
      pusher_type,
      sender
    } = context.payload;

    if (!ref_type === 'branch') {
      return;
    }

    const assignee = pusher_type === 'user' ? sender.login : null;

    const match = /^(\d+)[-_]+/.exec(ref);

    if (!match) {
      return;
    }

    const issue_number = match[1];
    this.log.info('Something created', context.payload.number, issue_number);

    const column = columns.getByState(IN_PROGRESS);

    return githubIssues.findAndMoveIssue(context, issue_number, column, assignee);
  });

};


// helpers //////////////////////

function isDraft(pull_request) {
  const {
    title,
    draft
  } = pull_request;

  return draft || /wip([^a-z]+|$)/i.test(title);
}


function isExternal(pull_request) {

  const {
    base,
    head
  } = pull_request;

  return base.repo.id !== head.repo.id;
}