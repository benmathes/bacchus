
## Requirements

- _Convert the list of port calls into a list of possible voyages between ports_
  - Done [in loopback, in the controller](https://github.com/benmathes/bacchus/blob/master/common/models/portCall.js#L7)
- _Provide an interface for listing all possible voyages between two dates, showing the port pairs and the vessel_
  - Done [in loopback, in the controller](https://github.com/benmathes/bacchus/blob/master/common/models/portCall.js#L7)
- _Add appropriate unit tests_
  - Some [basic spec tests](https://github.com/benmathes/bacchus/blob/master/test/portCall.js)
- _Create an npm run script inside package.json that uses supervisor to reload/rerun the code as you edit it._
  - [in this commit](https://github.com/benmathes/bacchus/commit/79186e85cf214b15fdf27944ada3dcf93b4eb728)



## Ambiguities/Questions

#### Moving containers between ships

If the USS Horcrux goes HKHKG->SGSIN->LAX, and the USS Dementor goes SGSIN->USOAK,
and the two ships overlap in SGSIN, is there a route between HKHKG and OAK? Containers would need to change ships.

I assumed the answer was **no** to make the coding easier, but it would make for a fun extra-credit section.



## Next Steps:

* persist the generated routes.
  * I'd set up a CPR (collect->process->reconcile) pipeline. Don't know loopback framework well enough to make time investment for homework assignment worth it. Happy to talk in person.
* To store the routes, Use my favorite pet algorithm: [Union-Find](http://www.geeksforgeeks.org/union-find-algorithm-set-2-union-by-rank/), where:
  * portCalls are items in the sets.
  * routes are compressed paths, i.e. start/end points in a shipping route.
  * _however_: The algo would have to be tweaked, as paths are date/time dependent.
  * A less-clever (which is good!) solution is just storing all the routes, but the # of routes grows geometrically w number of port calls, **especially** if we allow containers to swap ships.
* anywhere you see a `git grep -i TODO` (I would link to the github search results, but you can't search forked repos)



## Commentary

Why "bacchus"? I see neither grape/wine shipments nor locations.


## Issues

During `npm install`, the angular version was ambiguously required:
```
Unable to find a suitable version for angular, please choose one by typing one of the numbers below:
    1) angular#1.3.20 which resolved to 1.3.20 and is required by angular-resource#1.3.20
    2) angular#^1.4.0 which resolved to 1.6.2 and is required by bacchus
    3) angular#^1.0.8 which resolved to 1.6.2 and is required by angular-ui-router#0.3.2
    4) angular#>=1.4.0 which resolved to 1.6.2 and is required by angular-bootstrap#2.1.4

Prefix the choice with ! to persist it to bower.json

? Answer
```
I went with `angular 1.6.2`. Hopefully this does not effect anything.
