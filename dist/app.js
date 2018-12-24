"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressWinston = _interopRequireDefault(require("express-winston"));

var _common = require("./common");

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
var _default = app;
exports.default = _default;
app.set('json spaces', 2);
app.set('trust proxy', true);
app.use(_expressWinston.default.logger({
  winstonInstance: _common.logger
}));
app.use((req, res, next) => {
  const metadata = {};
  let period;
  const components = req.url.split(/\//g).map(c => decodeURIComponent(c));

  for (const component of components) {
    if (!('world' in metadata) && component in _common.worldId) {
      metadata.world = component;
    } else if (!('skill' in metadata) && component in _common.skillId) {
      metadata.skill = component;
    } else if (!period && (period = (0, _common.extractPeriod)(component))) {
      metadata.period = component;
    }
  }

  if (!('skill' in metadata)) {
    metadata.skill = 'kuulsus';
  }

  if (!period) {
    period = (0, _common.extractPeriod)('0d');
  }

  if ('world' in metadata) {
    const world = _common.worldId[metadata.world];
    const skill = _common.skillId[metadata.skill];
    (0, _common.getStats)(world, skill, period).then(stats => {
      res.send((0, _render.default)(metadata, period, stats));
    }, next);
  } else {
    res.send((0, _render.default)(metadata));
  }
}); // catch 404 and forward to error handler

app.use((req, res, next) => {
  res.status(404).send({
    error: 'Not Found',
    message: 'Page not found'
  });
});
app.use((e, req, res, next) => {
  if (e instanceof Error) {
    _common.logger.error('Application error ', {
      e: e.message,
      stack: e.stack
    });

    res.status(500).send('Internal Server Error');
  } else {
    _common.logger.error('Unknown application error ', {
      e
    });

    res.status(500).send();
  }
});