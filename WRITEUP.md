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
