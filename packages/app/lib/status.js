/**
 * A utility to maintain status
 */
class Status {

  constructor(data) {
    this.statuses = (data && data.statuses) || {};
    // this.statusIds = (data && data.statusIds) || {};
  }

  // {
  //   "statuses": [
  //     {
  //     "state": "success",
  //     "target_url": "https://jenkins-core.tools.cosmic.sky/job/core/job/core-platform-config/job/_trigger/384/display/redirect",
  //     "context": "core/core-platform-config/_trigger",
  //     },
  //     {
  //     "state": "failure",
  //     "target_url": "https://jenkins-core.tools.cosmic.sky/job/core/job/core-platform-config/job/kubernetes-resources/362/display/redirect",
  //     "context": "kubernetes-resources",
  //     }
  //     ],
  //   "sha": "a2ef08f9ece317ce6e7db880d5b9ab4117449dbb"
  // }
  addStatus(combinedStatusesForIssues) {
    const {
      sha,
      statuses
    } = combinedStatusesForIssues;

    const existingStatus = this.statuses[sha] = (this.statuses[sha] || {});

    const contexts = statuses.forEach(function(status) {
      const {
        context,
        state,
        target_url
      } = status;

      return contexts[context.toUpperCase()] = {
        target_url,
        state
      };
    });

    if (existingStatus) {
      // get current contexts
      const existingContextKeys = Object.keys(existingStatus);

      const existingContext = Object.keys(contexts).find(contextKey => existingContextKeys.find(contextKey));
      existingContext.forEach(key => {
        delete existingContext[key];
        existingStatus[key] = contexts[key];
        this.statuses[sha] = existingStatus;
      });
    } else {
      this.statuses[sha] = contexts;
    }
    const context = this.statuses[sha];
    return {
      sha,
      context
    };
  }

  /**
   * Get all links that have the issue as the source.
   *
   * @param {Number} sourceId
   */
  getBySha(sha) {
    const status = this.statuses.statuses[sha] || {};

    return Object.values({
      ...status
    });
  }

  // getById(id) {
  //   const sha = this.statusIds[id] || null;
  //
  //   let status = {};
  //
  //   if (sha) {
  //   status = this.statuses[sha] || {};
  //   }
  //   return Object.values({
  //   ...status
  //   });
  // }

  /**
   * Remove primary links that have the issue as the source.
   *
   * @param {Number} sourceId
   *
   * @return {Object} removedLinks
   */
  removeBySha(sha) {

    const statuses = this.statuses.statuses[sha] || {};

    for (const [_, status] of Object.entries(statuses)) {

      const {
        id
      } = status;

      const inverseStatus = this.statusById[id] || {};

      delete inverseStatus[`${id}`];
    }

    this.statuses[sha] = {};

    return statuses;
  }

  /**
   * Serialize data to JSON so that it can
   * later be loaded via #loadJSON.
   */
  asJSON() {
    const {
      statuses
    } = this;

    return JSON.stringify({
      statuses
    });
  }

  /**
   * Load a JSON object, previously serialized via Links#toJSON.
   */
  loadJSON(json) {
    const {
      statuses
    } = JSON.parse(json);

    this.statuses = statuses || {};
  }

}

module.exports.Status = Status;
