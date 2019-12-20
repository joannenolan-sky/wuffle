var Register = require('prom-client').register;
var Counter = require('prom-client').Counter;

const eventCounter = new Counter({
  name: 'eventCounter',
  help: 'Event type and the labels for issues and pull requests',
  labelNames: ['type', 'event', 'labels', 'repository']
});

function eventsCounter(type, event, labels, repository) {
  eventCounter.inc({
    type: type,
    event: event,
    labels: labels.map(label => label.name),
    repository: repository });
}

module.exports.eventsCounter = eventsCounter;

function injectMetricsRoute(router) {
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', Register.contentType);
    res.end(Register.metrics());
  });
}

module.exports.injectMetricsRoute = injectMetricsRoute;
