
var Register = require('prom-client').register;
var Counter = require('prom-client').Counter;

const eventCounter = new Counter({
  name: 'events',
  help: 'Count of event and the labels for issues and pull requests',
  labelNames: ['type', 'event', 'labels']
});

function eventsCounter(type, event, labels) {

  eventCounter.inc({ type: type, event: event, labels:labels });
}
module.exports.eventsCounter = eventsCounter;

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
function injectMetricsRoute(router) {
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', Register.contentType);
    res.end(Register.metrics());
  });
}

module.exports.injectMetricsRoute = injectMetricsRoute;
