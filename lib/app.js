import express from 'express';
import expressWinston from 'express-winston';
import { extractPeriod, getStats, logger, skillId, worldId } from './common';
import render from './render';


const app = express();
export default app;


app.set('json spaces', 2);
app.set('trust proxy', true);


app.use(expressWinston.logger({ winstonInstance: logger }));


app.use((req, res) => {
	const metadata = {};
	let period;
	const components = req.url.split(/\//g).map(c => decodeURIComponent(c));
	for(const component of components) {
		if(!('world' in metadata) && component in worldId) {
			metadata.world = component;
		} else if(!('skill' in metadata) && component in skillId) {
			metadata.skill = component;
		} else if(!period && (period = extractPeriod(component))) {
			metadata.period = component;
		}
	}

	if(!('skill' in metadata)) {
		metadata.skill = 'kuulsus';
	}

	if(!period) {
		period = extractPeriod('0d');
	}

	if('world' in metadata) {
		const world = worldId[metadata.world];
		const skill = skillId[metadata.skill];
		getStats(world, skill, period)
			.then(stats => {
				res.send(render(metadata, period, stats));
			}, e => {
				logger.error('Error getting tables from database', { e: e.message });
				res.status(500).send('Internal Server Error');
			});
	} else {
		res.send(render(metadata));
	}
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404).send({
		error: 'Not Found',
		message: 'Page not found'
	});
});


app.use((e, req, res, next) => {
	if(e instanceof Error) {
		logger.error('Application error ', { e: e.message, stack: e.stack });
		res.status(500).send({
			error: 'Internal Server Error',
			message: 'Something has gone wrong'
		});
	} else {
		logger.error('Unknown application error ', { e });
		res.status(500).send();
	}
});
