"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _common = require("./common");

/**
 * @return {void}
 */
async function takeSnapshots() {
  while (true) {
    try {
      const date = new Date();
      const keys = [];

      for (const world in _common.worldName) {
        for (const skill in _common.skillName) {
          const docId = `snapshot/${world}-${skill}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          keys.push(docId);
        }
      }

      const docs = await _common.db.allDocs({
        keys
      });
      const neededSnapshots = [];

      for (let i = 0; i < docs.rows.length; i++) {
        if (docs.rows[i].error === 'not_found') {
          const m = /^snapshot\/([^-]+)-([0-9]+)-/.exec(docs.rows[i].key);
          neededSnapshots.push({
            world: m[1],
            skill: Number(m[2])
          });
        } else if ('error' in docs.rows[i]) {
          _common.logger.error('Failed to query snapshot', docs.rows[i]);
        }
      }

      if (neededSnapshots.length === 0) {
        const nextDate = new Date(date.getTime());
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(0, 0, 5, 0);
        const timeToNextDay = nextDate - date;

        _common.logger.debug('Waiting for next day', {
          timeToNextDay
        });

        await (0, _common.timeout)(Math.min(timeToNextDay, 120000));
      } else {
        const promises = [];

        for (const {
          world,
          skill
        } of neededSnapshots) {
          promises.push((0, _common.createTable)(world, skill).catch(e => {
            _common.logger.error('Failed to take snapshots', {
              e: e.message
            });
          }));
        }

        await Promise.all(promises);
        await (0, _common.timeout)(3000);
      }
    } catch (e) {
      _common.logger.error('Failed to take snapshots', {
        e: e.message
      });

      await (0, _common.timeout)(3000);
    }
  }
}

function _default() {
  // no need to catch
  takeSnapshots();
}