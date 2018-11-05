"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _jsonschema = require("jsonschema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let jsonConfig, config;

if (process.argv.length >= 3) {
  try {
    console.log('Reading configuration from %s', process.argv[2]);
    jsonConfig = _fs.default.readFileSync(process.argv[2]);
  } catch (e) {
    console.error('Failed to read configuration file: ', e.message);
    process.exit(1);
  }
} else {
  try {
    console.log('Reading configuration from standard input');
    jsonConfig = _fs.default.readFileSync(0);
  } catch (e) {
    console.error('Failed to read configuration from standard input: ', e.message);
    process.exit(1);
  }
}

try {
  config = JSON.parse(jsonConfig);
} catch (e) {
  console.error('Failed to parse configuration: ' + e.message);
  process.exit(1);
}

const validationResult = (0, _jsonschema.validate)(config, {
  type: 'object',
  properties: {
    listen: {
      oneOf: [{
        type: 'string',
        enum: ['systemd']
      }, {
        type: 'object',
        properties: {
          port: {
            type: 'integer',
            min: 1,
            max: 65535
          },
          address: {
            type: 'string',
            minLength: 1
          }
        },
        additionalProperties: false,
        required: ['port']
      }, {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            minLength: 1
          },
          mode: {
            oneOf: [{
              type: 'string'
            }, {
              type: 'integer'
            }]
          }
        },
        additionalProperties: false,
        required: ['path']
      }]
    },
    database: {
      type: 'string',
      minLength: 1
    },
    appUrl: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['listen', 'database', 'appUrl'],
  additionalProperties: false
});

if (validationResult.errors.length) {
  console.error('Found configuration errors:');

  for (const error of validationResult.errors) {
    console.error(error.message);
  }

  process.exit(1);
}

var _default = config;
exports.default = _default;