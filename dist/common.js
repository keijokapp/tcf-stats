"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFame = calculateFame;
exports.timeout = timeout;
exports.getStats = getStats;
exports.extractPeriod = extractPeriod;
exports.createTable = createTable;
exports.logger = exports.db = exports.skillName = exports.skillId = exports.worldName = exports.worldId = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _winston = _interopRequireDefault(require("winston"));

var _pouchdb = _interopRequireDefault(require("pouchdb"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const worldId = {
  'valge': 'valge',
  'white': 'valge',
  'sinine': 'sinine',
  'blue': 'sinine',
  'world1': 'world1',
  'roheline': 'world1',
  'green': 'world1',
  'world2': 'world2',
  'must': 'world2',
  'black': 'world2'
};
exports.worldId = worldId;
const worldName = {
  valge: 'valge',
  sinine: 'sinine',
  world1: 'roheline',
  world2: 'must'
};
exports.worldName = worldName;
const skillId = {
  'kuulsus': 0,
  'aiandus': 2,
  'joogimeister': 3,
  'jõud': 4,
  'kaitse': 5,
  'kaklemine': 6,
  'keemik': 7,
  'kiirus': 8,
  'kokandus': 9,
  'käsitöö': 10,
  'osavus': 11,
  'raviteadus': 12,
  'relvakäsitsus': 13,
  'varastamine': 14,
  'vastupidavus': 15,
  'sepistamine': 32,
  'kaevandamine': 34
};
exports.skillId = skillId;
const skillName = {};
exports.skillName = skillName;

for (const i in skillId) {
  skillName[skillId[i]] = i;
}

Object.assign(skillId, {
  'kuulsuse': 0,
  'aianduse': 2,
  'joogimeistri': 3,
  'jõu': 4,
  'kaklemise': 6,
  'keemiku': 7,
  'kiiruse': 8,
  'kokanduse': 9,
  'osavuse': 11,
  'raviteaduse': 12,
  'relvakäsitsuse': 13,
  'varastamise': 14,
  'vastupidavuse': 15,
  'sepistamise': 32,
  'kaevandamise': 34,
  jk: 3,
  jook: 3,
  kt: 10,
  rt: 12,
  rk: 13,
  vp: 15,
  sepp: 32,
  kaevur: 34
});

const fameFormula0 = v => v * v * 9;

const fameFormula1 = v => (v - 9) * (v - 9) * 3;

const fameFormula2 = v => (v - 9) * (v - 9) * 2;

const fameFormula3 = v => v * v * 3;

const fameFormula4 = v => (v - 5) * (v - 5) * 3;

const fameFormulas = {
  aiandus: fameFormula0,
  joogimeister: fameFormula0,
  jõud: fameFormula1,
  kaitse: fameFormula1,
  keemik: fameFormula0,
  kiirus: fameFormula2,
  kokandus: fameFormula3,
  käsitöö: fameFormula0,
  osavus: fameFormula1,
  raviteadus: fameFormula0,
  relvakäsitsus: fameFormula0,
  varastamine: fameFormula3,
  vastupidavus: fameFormula4,
  sepistamine: fameFormula0,
  kaevandamine: fameFormula0
};
/**
 * Calculates fame by given skills
 * @param skills {object}
 * @returns {number}
 */

function calculateFame(skills) {
  let fame = 0;

  for (const skill in fameFormulas) {
    if (Number.isFinite(skills[skill])) {
      fame += fameFormulas[skill](skills[skill]);
    }
  }

  return fame;
}

const db = new _pouchdb.default(_config.default.database);
exports.db = db;

const logger = _winston.default.createLogger({
  format: _winston.default.format.simple(),
  transports: [new _winston.default.transports.Console({
    level: 'debug'
  })]
});
/**
 * Returns promise which resolves after given period
 * @param period {number}
 * @returns {Promise}
 */


exports.logger = logger;

function timeout(period) {
  return new Promise(resolve => setTimeout(resolve, period));
}
/**
 * Loads bulk of tables from database
 * @param descriptors {object} world, skill & date triples
 * @returns {array} array of table documents, null representing non-existent table
 */


async function getTables(...descriptors) {
  const keys = [];

  for (const {
    world,
    skill,
    date
  } of descriptors) {
    const docId = `snapshot/${world}-${skill}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    keys.push(docId);
  }

  const docs = await db.allDocs({
    keys,
    include_docs: true
  });
  const tables = [];

  for (const row of docs.rows) {
    if (row.error === 'not_found') {
      tables.push(null);
    } else if ('error' in row) {
      throw new Error(row.error);
    } else {
      tables.push(row.doc);
    }
  }

  return tables;
}
/**
 * Extracts new users and changed users from given pair of tables
 * @param startTable {object} start table
 * @param endTable {object} end table
 * @returns {object} extracted information
 */


function processTables(startTable, endTable) {
  const users = {};
  const newUsers = [],
        lostRanks = [];
  const changedUsers = [];
  let newRanksShift = 0,
      lostRanksShift = 0;

  for (const i in endTable.users) {
    users[i] = {
      user: i,
      rank: endTable.users[i].rank,
      value: endTable.users[i].value
    };

    if (!(i in startTable.users)) {
      newUsers.push(i);
    } else {
      const valueDiff = endTable.users[i].value - startTable.users[i].value;

      if (valueDiff) {
        users[i].rankDiff = startTable.users[i].rank - endTable.users[i].rank;
        users[i].valueDiff = valueDiff;
        changedUsers.push(i);
      }
    }
  }

  for (const i in startTable.users) {
    if (!(i in endTable.users)) {
      lostRanks.push(startTable.users[i].rank);
    }
  }

  newUsers.sort((v1, v2) => users[v1].rank - users[v2].rank);
  changedUsers.sort((v1, v2) => users[v1].rank - users[v2].rank);
  lostRanks.sort((v1, v2) => v1 - v2);

  for (const user of changedUsers) {
    while (newRanksShift < newUsers.length && users[newUsers[newRanksShift]].rank < users[user].rank) {
      newRanksShift++;
    }

    while (lostRanksShift < lostRanks.length && lostRanks[lostRanksShift] < users[user].rank) {
      lostRanksShift++;
    }

    users[user].normalizedRankDiff = users[user].rankDiff + newRanksShift - lostRanksShift;
  }

  return {
    users,
    newUsers,
    changedUsers
  };
}
/**
 * Cache of processed stats tables
 * keyed by `world-skill-startTime-endTime` strings
 */


let statsCache = {}; // very naive cache clearing implementation
// empties cache approximately every 1 hour

setInterval(() => {
  logger.info('Clearing cache', {
    cacheSize: Object.keys(statsCache).length
  });
  statsCache = {};
}, 60 * 3600 * 1000);
/**
 * Creates cache key for given arguments
 * @param world {string} world name
 * @param skill {string} skill name
 * @param period {object} startTime and endTime as Date instances
 * @returns {string}
 */

function getCacheKey(world, skill, period) {
  const startTimeString = `${period.startTime.getFullYear()}-${period.startTime.getMonth() + 1}-${period.startTime.getDate()}`;
  const endTimeString = `${period.endTime.getFullYear()}-${period.endTime.getMonth() + 1}-${period.endTime.getDate()}`;
  return `${world}-${skill}-${startTimeString}-${endTimeString}`;
}
/**
 * Loads and processes tables for given world, skill & period
 * @param world {string} world name
 * @param skill {string} skill name
 * @param period {object} startTime and endTime as Date instances
 * @return {object} startTime & endTime of loaded tables and newUsers & changedUsers if both tables exist
 */


async function getStats(world, skill, period) {
  const cacheKey = getCacheKey(world, skill, period);

  if (cacheKey in statsCache) {
    logger.debug('Cache hit', {
      world,
      skill,
      startTime: period.startTime,
      endTime: period.endTime
    });
    return statsCache[cacheKey];
  }

  logger.debug('Cache miss', {
    world,
    skill,
    startTime: period.startTime,
    endTime: period.endTime
  });
  const [startTable, endTable] = await getTables({
    world,
    skill,
    date: period.startTime
  }, {
    world,
    skill,
    date: period.endTime
  });

  if (cacheKey in statsCache) {
    return statsCache[cacheKey];
  }

  const ret = {
    startTime: startTable && new Date(startTable.time),
    endTime: endTable && new Date(endTable.time)
  };

  if (startTable !== null && endTable !== null) {
    Object.assign(ret, processTables(startTable, endTable));
    statsCache[cacheKey] = ret;
  }

  return ret;
}
/**
 * Extract period from the URL token using some regex magic
 * @param token {string} URL token
 * @returns {object} Object containing startTime and endTime or null
 */


function extractPeriod(token) {
  const REGEXP_DATE = '[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}';
  let m, startTime, endTime;

  if (m = new RegExp(`^(${REGEXP_DATE})-(${REGEXP_DATE})$`).exec(token)) {
    startTime = new Date(m[1].split('.').reverse().join('-'));
    endTime = new Date(m[2].split('.').reverse().join('-'));
  } else if (m = new RegExp(`^(${REGEXP_DATE})t$`).exec(token)) {
    startTime = new Date(m[1].split('.').reverse().join('-'));
    endTime = new Date();
  } else if (m = new RegExp(`^(${REGEXP_DATE})([dpwnmkt])?$`).exec(token)) {
    endTime = new Date(m[1].split('.').reverse().join('-'));
    startTime = new Date(endTime.getTime());

    switch (m[2]) {
      default:
      case 'd':
      case 'p':
        startTime.setDate(endTime.getDate() - 1);
        break;

      case 'w':
      case 'n':
        startTime.setDate(startTime.getDate() - (startTime.getDay() + 6) % 7);
        break;

      case 'm':
      case 'k':
        startTime.setDate(1);
        break;
    }
  } else if (m = new RegExp(`^([0-9]+)([dpwnmk])$`).exec(token)) {
    if (!m[1]) {
      m[1] = '1';
    }

    if (!m[2]) {
      m[2] = 'd';
    }

    switch (m[2]) {
      case 'd':
      case 'p':
        startTime = new Date();
        startTime.setDate(startTime.getDate() - m[1] - 1);
        endTime = new Date(startTime.getTime());
        endTime.setDate(endTime.getDate() + 1);
        break;

      case 'w':
      case 'n':
        startTime = new Date();
        startTime.setDate(startTime.getDate() - (startTime.getDay() + 6) % 7 - 7 * m[1]);

        if (m[1] === '0') {
          endTime = new Date();
        } else {
          endTime = new Date(startTime.getTime() + 7 * 24 * 3600 * 1000);
        }

        break;

      case 'm':
      case 'k':
        startTime = new Date();
        startTime.setMonth(startTime.getMonth() - m[1], 1);

        if (m[1] === '0') {
          endTime = new Date();
        } else {
          endTime = new Date(startTime.getTime());
          endTime.setMonth(endTime.getMonth() + 1, 1);
        }

        break;
    }
  } else {
    return null;
  }

  startTime.setHours(0, 0, 0, 0);
  endTime.setHours(0, 0, 0, 0);
  return {
    startTime,
    endTime
  };
}
/**
 * Fetch single page from TOP
 * @param world {string} codename of the world
 * @param skill {integer} numeric skill id
 * @param page {integer} page number
 * @returns {array} array of rows on page
 */


async function fetchTablePage(world, skill, page) {
  const response = await (0, _nodeFetch.default)(`http://crime.ee/index.php?a=8&top=${skill}&m=${world}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'rank=' + (page * 40 + 20)
  });
  const body = await response.text();
  const regex = /<tr class="(?:lighter|darker|checked)">\n\t\t\t\t<td><strong>([0-9]+)\.<\/strong><\/td>\n\t\t\t\t<td>\n\t\t\t\t<img src="\/(?:punane|roheline)\.gif" width="15" height="15" class="floatl" \/> (?:\n\t\t\t\t<span class="cflags f_[A-Z]{3}" alt="[^"]+" title="[^"]+"><\/span>)?\n\t\t\t\t<a href="\/index\.php\?a=11&m=[a-z0-9]+&k=([^"]+)">(?:[^<]+)<\/a>\n\t\t\t\t<\/td>\n\t\t\t\t<td><strong>\n([0-9,.]+)\t\t\t\t<\/strong> (?:Levelit|Kuulsust|Linna)<\/td>\n\t\t\t<\/tr>/g;
  const result = [];
  let m;

  while (m = regex.exec(body)) {
    result.push({
      rank: Number(m[1]),
      user: m[2],
      value: Number(m[3].replace(/,/g, ''))
    });
  }

  if (result.length === 0) {
    throw new Error('Bad response');
  }

  return result;
}
/**
 * Fetch all pages from TOP
 * @param world {string} codename of the world
 * @param skill {integer} numeric skill id
 * @returns {object} user => { rank, value } map
 */


async function fetchTable(world, skill) {
  const result = {};
  let i = 0;
  let highestRank = 0;

  while (highestRank >= i * 40) {
    const page = await fetchTablePage(world, skill, i);

    for (const row of page) {
      result[row.user] = {
        rank: row.rank,
        value: row.value
      };

      if (row.rank > highestRank) {
        highestRank = row.rank;
      }
    }

    i++;
  }

  return result;
}
/**
 * Fetch, confirm and save TOP
 * @param world {string} codename of the world
 * @param skill {integer} numeric skill id
 */


async function createTable(world, skill) {
  let users = await fetchTable(world, skill);
  let date;
  logger.debug('Fetching table', {
    world,
    skill
  });

  confirm: while (true) {
    date = new Date();
    logger.debug('Confirming', {
      world,
      skill,
      date
    });
    const confirmationTable = await fetchTable(world, skill);

    if (Object.keys(users).length !== Object.keys(confirmationTable).length) {
      users = confirmationTable;
      continue;
    }

    for (const i in users) {
      if (!(i in confirmationTable) || users[i].value !== confirmationTable[i].value) {
        users = confirmationTable;
        continue confirm;
      }
    }

    break;
  }

  logger.info('Fetched table', {
    world,
    skill,
    date,
    size: Object.keys(users).length
  });
  const docId = `snapshot/${world}-${skill}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  try {
    await db.put({
      _id: docId,
      world,
      skill,
      time: date.getTime(),
      users
    });
  } catch (e) {
    if (e.name === 'conflict') {
      logger.warn('Snapshot already exists', {
        world,
        skill,
        date
      });
    } else {
      throw e;
    }
  }
}