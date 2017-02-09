'use strict';

var _ = require('underscore');

module.exports = function(PortCall) {

  PortCall.getRoutes = function(etd, eta, cb) {
    // As supplied from haven, null in etd or eta means explicitly
    // those calls with null in etd/eta respectively. I.e.
    // When a query asks for "routes w/ ETA after 2012", they actually
    // will get "routes w/ ETA after 2012 and null etd" but they mean
    // "routes w/ ETA after 2012 and ANY etd"
    var andClauses = [];
    if (etd !== undefined && etd !== null) {
      andClauses.push({or: [{ etd: { gte: etd } }, { etd: null }]});
    }
    if (eta !== undefined && eta !== null) {
      andClauses.push({or: [{ eta: { lte: eta } }, { eta: null }]});
    }

    const query = {
      where: { and: andClauses },
      // ensures we iterate over the calls in order.
      // TODO: how does loopback index?
      order: ['routeId DESC', 'eta ASC' ]
    };

    PortCall.find(query)
      .then(calls => {
        // TODO: timezones? Appears to be read in GMT,
        // output in local
        var routeIdToStarts = [];
        var routes = [];
        _.each(calls, (endCall, i) => {
          if (routeIdToStarts[endCall.routeId] == null) {
            routeIdToStarts[endCall.routeId] = [];
          }

          // add a route from all previous calls to this destination
          _.each(routeIdToStarts[endCall.routeId], (startCall) => {
            // some routes double back, don't add
            // a route from somewhere to itself.
            if (startCall.port === endCall.port) { return; }

            routes.push({
              startPort: startCall.port,
              endPort: endCall.port,
              routeId: startCall.routeId,
              vessel: startCall.vessel,
              etd: startCall.etd,
              eta: endCall.eta,
              // for checking data accuracy
              startCallId: startCall.id,
              endCallId: endCall.id
            });
          });

          // NOTE: observe edge cases for first/last calls in a route.
          // first: above loop will have no start. we won't add a route _to_ it.
          // last: no calls after it, so we won't add a route _from_ it.
          routeIdToStarts[endCall.routeId].push(endCall);
        });

        routes = _.sortBy(routes, (route) => {
          return [parseInt(route.startCallId, 10), parseInt(route.endCallId)];
        });
        return cb(null, routes);
      })
      .catch(err => {
        console.log(err);
        return cb(err);
      });
  };

  PortCall.remoteMethod('getRoutes', {
    accepts: [
      { arg: 'etd', 'type': 'date' },
      { arg: 'eta', 'type': 'date' }
    ],
    returns: [
      { arg: 'routes', type: 'array', root: true }
    ]
  });

};
