import fetch from 'node-fetch';
import winston from 'winston';
import PouchDB from 'pouchdb';
import pouchSeed from 'pouchdb-seed-design';
import config from './config';
import cleanup from './cleanup';


export const worldId = {
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


export const worldName = {
	valge: 'valge',
	sinine: 'sinine',
	world1: 'roheline',
	world2: 'must'
};


export const skillId = {
	'kuulsus': 0,
	'aiandus': 2,
	'joohimeister': 3,
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


export const skillName = {};

for(const i in skillId) {
	skillName[skillId[i]] = i;
}


Object.assign(skillId, {
	'kuulsuse': 0,
	'aianduse': 2,
	'joogimeistry': 3,
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


export const db = new PouchDB(config.database);

pouchSeed(db, {
	daily: {
		views: {
			daily: {
				map: function(doc) {
					const date = new Date(doc.time);
					date.setHours(0, 0, 0, 0);
					emit([doc.world, Number(doc.skill), date.getTime()]);
				}
			}
		}
	}
})
	.then(updated => {
		if(updated) {
			logger.info('Design documents updated');
		} else {
			logger.debug('Design documents didn\'t need updates');
		}
	}, e => {
		logger.error('Failed to seed database with design documents', { e: e.message });
		cleanup(1);
	});


export const logger = winston.createLogger({
	format: winston.format.simple(),
	transports: [new winston.transports.Console({ level: 'debug' })]
});


export async function getTable(world, skill, date) {
	const result = await db.query('daily', { key: [world, skill, date.getTime()], include_docs: true });
	return result.rows.length > 0 ? result.rows[0].doc : null;
}


/**
 * Extract period from the URL token using some regex magic
 * @param token {string} URL token
 * @returns {object} Object containing startTime and endTime or null
 */
export function extractPeriod(token) {
	const REGEXP_DATE = '[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}';
	let m, startTime, endTime;
	if(m = new RegExp(`^(${REGEXP_DATE})-(${REGEXP_DATE})$`).exec(token)) {
		startTime = new Date(m[1].split('.').reverse().join('-'));
		endTime = new Date(m[2].split('.').reverse().join('-'));
	} else if(m = new RegExp(`^(${REGEXP_DATE})t$`).exec(token)) {
		startTime = new Date(m[1].split('.').reverse().join('-'));
		endTime = new Date;
	} else if(m = new RegExp(`^(${REGEXP_DATE})([dpwnmkt])?$/`).exec(token)) {
		endTime = new Date(m[1].split('.').reverse().join('-'));
		startTime = new Date(endTime.getTime());
		switch(m[2]) {
			default:
			case'd':
			case'p':
				startTime.setDate(endTime.getDate() - 1);
				break;
			case'w':
			case'n':
				startTime.setDate(startTime.getDate() - ((startTime.getDay() + 6) % 7));
				break;
			case'm':
			case'k':
				startTime.setDate(1);
				break;
		}
	} else if(m = new RegExp(`^([0-9]+)([dpwnmk])$`).exec(token)) {
		if(!m[1]) {
			m[1] = '1';
		}
		if(!m[2]) {
			m[2] = 'd';
		}
		switch(m[2]) {
			case'd':
			case'p':
				startTime = new Date();
				startTime.setDate(startTime.getDate() - m[1] - 1);
				endTime = new Date(startTime.getTime());
				endTime.setDate(endTime.getDate() + 1);
				break;
			case'w':
			case'n':
				startTime = new Date();
				startTime.setDate(startTime.getDate() - ((startTime.getDay() + 6) % 7) - 7 * m[1]);
				if(m[1] === '0') {
					endTime = new Date;
				} else {
					endTime = new Date(startTime.getTime() + 7 * 24 * 3600 * 1000);
				}
				break;
			case'm':
			case'k':
				startTime = new Date();
				startTime.setMonth(startTime.getMonth() - m[1], 1);
				if(m[1] === '0') {
					endTime = new Date;
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

	return { startTime, endTime };
}


/**
 * Fetch single page from TOP
 * @param world {string} codename of the world
 * @param skill {integer} numeric skill id
 * @param page {integer} page number
 * @returns {array} array of rows on page
 */
async function fetchTablePage(world, skill, page) {
	const response = await fetch(`http://crime.ee/index.php?a=8&top=${skill}&m=${world}`, {
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
	while(m = regex.exec(body)) {
		result.push({ rank: Number(m[1]), user: m[2], value: Number(m[3].replace(/,/g, '')) });
	}
	if(result.length === 0) {
		throw new Error('Bad response');
	}
	return result;
}


/**
 * Fetch all pages from TOP
 * @param world {string} codename of the world
 * @param skill {integer} numberic skill id
 * @returns {object} user => { rank, value } map
 */
async function fetchTable(world, skill) {
	const result = {};
	let i = 0;
	let highestRank = 0;
	while(highestRank >= i * 40) {
		const page = await fetchTablePage(world, skill, i);
		for(const row of page) {
			result[row.user] = { rank: row.rank, value: row.value };
			if(row.rank > highestRank) {
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
 * @param skill {integer} numberic skill id
 */
async function createTable(world, skill) {
	let users = await fetchTable(world, skill);
	let time;
	console.log('Fetching table', { world, skill });
	confirm: while(true) {
		time = Date.now();
		console.log('Confirming', { world, skill, time });
		const confirmationTable = await fetchTable(world, skill);
		if(Object.keys(users).length !== Object.keys(confirmationTable).length) {
			users = confirmationTable;
			continue;
		}

		for(const i in users) {
			if(!(i in confirmationTable) || users[i].value !== confirmationTable[i].value) {
				users = confirmationTable;
				continue confirm;
			}
		}

		break;
	}

	console.log('Fetched table', { world, skill, time, size: Object.keys(users).length });

	// await db.post({ world, skill, time, users });
}

/**
 * Fetch, confirm and save all TOP-s of all worlds
 */
export async function createTables() {
	const promises = [];
	for(const world in worldName) {
		for(const skill in skillName) {
			promises.push(createTable(world, Number(skill)).catch(e => console.error('Failed to fetch table', {
				world,
				skill,
				e: e.message
			})));
		}
	}
	await Promise.all(promises);
}

// createTables().catch(e => console.error(e));
