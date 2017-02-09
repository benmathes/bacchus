'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('underscore');
const server = require('../server/server');
const assert = chai.assert;
const should = chai.should();
const { PortCall } = server.models;

chai.use(chaiHttp);


// NOTE: in interest of time, using /server/data/portCalls.json as test
// data scaffolding. Not the perfect test situation, but I haven't learned
// how to make scaffolding test data with loopback.

// I would much rather specify factories or scaffoldings to isolate
// test conditions.


describe('PortCall', () => {
  const routesURL = '/api/PortCalls/getRoutes';

  var runTest = (args, cb) => {
    chai.request(server)
      .post(routesURL)
      .send(args)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        cb.apply(null, [err, res]);
      });
  };

  // helper function to take server results
  // and compare to a simplified start/end port name
  var verifyRoutes = (results, targets) => {
    results.length.should.equal(targets.length);
    // iterate from end because we will remove the result
    // after we find it so it isn't double-counted
    for (var i=results.length-1; i >= 0; i--) {
      var result = results[i];
      for (var j=targets.length-1; j >= 0; j--) {
        var target = targets[j];
        if (target[0] === result.startPort && target[1] === result.endPort) {
          // match: remove the route from the results and the targets
          results.splice(i,1);
          targets.splice(j,1);
          break;
        }
      };
    }
    results.length.should.equal(0);
    targets.length.should.equal(0);
  };

  it('should list ALL routes with no date filters', (done) => {
    runTest({}, (err, res) => {
      res.body.length.should.equal(28);
      done();
    });
  });

  it('should list routes with only etd filter', (done) => {
    // filtering down to route 4, everything after LAX
    runTest({etd: '2016-1-27'}, (err, res) => {
      verifyRoutes(res.body, [
        ['USLAX', 'HKHKG'],
        ['USLAX', 'SGSIN'],
        ['HKHKG', 'SGSIN'],
      ]);
      done();
    });
  });

  it('should list routes with etd and eta filter', (done) => {
    // filtering down to route 4, LAX->HK
    runTest({etd: '2016-1-27', eta: '2016-1-31'}, (err, res) => {
      verifyRoutes(res.body, [['USLAX', 'HKHKG']]);
      done();
    });
  });

  it('should not count routes that double back', (done) => {
    // route 2 doubles back and goes: HK->LA->OAK->SG->HK->LA.
    // correct to see HK->LA twice, but not HK->HK
    runTest({etd: '2016-1-04', eta: '2016-1-22'}, (err, res) => {
      // this etd/eta picks up a bit of route 3 and 1
      const route2Results = _.filter(res.body, (result) => {
        return result.routeId === '2';
      });
      route2Results.length.should.equal(13);
      verifyRoutes(route2Results, [
        ['HKHKG', 'USLAX'],
        ['HKHKG', 'USOAK'],
        ['HKHKG', 'SGSIN'],
        ['HKHKG', 'USLAX'],
        ['USLAX', 'USOAK'],
        ['USLAX', 'SGSIN'],
        ['USLAX', 'HKHKG'],
        ['USOAK', 'SGSIN'],
        ['USOAK', 'HKHKG'],
        ['USOAK', 'USLAX'],
        ['SGSIN', 'HKHKG'],
        ['SGSIN', 'USLAX'],
        ['HKHKG', 'USLAX'],
      ]);
      done();
    });
  });


});
