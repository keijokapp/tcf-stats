import React from 'react';
import { renderToString } from 'react-dom/server';
import config from './config';
import { calculateFame, skillId, skillName, worldId, worldName } from './common';


function buildUrl(metadata, mutation) {
	const tokens = [];
	const world = mutation.world || metadata.world || '';
	if(world) {
		tokens.push(world);
	}
	const skill = mutation.skill || metadata.skill || '';
	if(skill) {
		tokens.push(skill);
	}
	const period = mutation.period || metadata.period || '';
	if(period) {
		tokens.push(period);
	}

	return tokens.join('/');
}


function prependZero(value) {
	return ('0' + value).slice(-2);
}


function Home(props) {
	return <div className="container">
		<h2>...</h2>
		<div style={{ margin: 'auto', textAlign: 'center' }}>
			<table style={{ margin: 'auto', width: '88%', textAlign: 'center' }}>
				<tr>
					<td>
						<p>
							<b>Eelmine/üleeelmine päev</b><br/>
							/<i>maailm</i>/1<br/>
							/<i>maailm</i>/2<br/>
						</p>
						<p>
							<b>Selle kuu/nädala algusest tänaseni</b><br/>
							/<i>maailm</i>/0m<br/>
							/<i>maailm</i>/0w<br/>
						</p>
						<p>
							<b>Eelmine kuu/nädal</b><br/>
							/<i>maailm</i>/1m<br/>
							/<i>maailm</i>/1w<br/>
						</p>
						<p>
							<b>Üleeelmine kuu/nädal</b><br/>
							/<i>maailm</i>/2m<br/>
							/<i>maailm</i>/2w<br/>
						</p>
						<p>
							<b>Vastava kuu/nädala algusest päevani</b><br/>
							/<i>maailm</i>/<i>kuupäev</i>m<br/>
							/<i>maailm</i>/<i>kuupäev</i>w<br/>
						</p>
						<p>
							<b>Kuupäevast tänaseni</b><br/>
							/<i>maailm</i>/<i>kuupäev</i>t<br/>
							<b>Kuupäevast kuupäevani</b><br/>
							/<i>maailm</i>/<i>kuupäev</i>-<i>kuupäev</i><br/>
						</p>

						Kuupäevad peavad olema kujul d.m.yyyy<br/>
						<i>maailm</i> saab olla üks järgnevatest:<br/> valge, white, sinine, blue, roheline, world1,
						green, must, world2, black
					</td>
					<td>
						<b>Skillid</b><br/>
						Soovi korral tuleb oskuse eestikeelne nimetus<br/>
						kirjutada argumendina <i>maailm</i> ja <i>periood</i>
						vahele.<br/><br/>

						<b>Nimetusena sobivad ka oskuste omastavad<br/>käänded, oskuste ID´d ning tuntud
							lühendid:</b><br/>
						jm, jook, kt, rt, rk, vp, sepp, kaevur
					</td>
				</tr>
			</table>
		</div>
	</div>;
}


function MetaData(props) {
	const startTime = props.stats.startTime !== null ? new Date(props.stats.startTime) : props.period.startTime;
	const endTime = props.stats.endTime !== null ? new Date(props.stats.endTime) : props.period.endTime;
	return <div id="andmed" className="container">
		<h2>Info</h2>
		<ul>
			<li><strong>Algus:</strong> <span
				style={{ color: props.stats.startTime === null ? 'red' : '' }}>{`${startTime.getDate()}.${prependZero(startTime.getMonth() + 1)}.${startTime.getFullYear()} ${prependZero(startTime.getHours())}:${prependZero(startTime.getMinutes())}`}</span>
			</li>
			<li><strong>Lõpp:</strong> <span
				style={{ color: props.stats.endTime === null ? 'red' : '' }}>{`${endTime.getDate()}.${prependZero(endTime.getMonth() + 1)}.${endTime.getFullYear()} ${prependZero(endTime.getHours())}:${prependZero(endTime.getMinutes())}`}</span>
			</li>
			{props.stats.newUsers && <li><strong>Uusi kasutajaid:</strong> <span>{props.stats.newUsers.length}</span></li>}
			{props.stats.changedUsers && <li><strong>Arenenud kasutajaid:</strong><span>{props.stats.changedUsers.length}</span></li>}
		</ul>
	</div>;
}


function SkillMenu(props) {
	const skill = skillId[props.metadata.skill];
	const menuItems = [];
	for(const id in skillName) {
		const name = skillName[id];
		menuItems.push(<li key={id} style={{ fontWeight: skill.toString() === id ? 'bold' : '' }}>
			» <a href={buildUrl(props.metadata, { skill: name })}> {name.charAt(0).toUpperCase() + name.slice(1)}</a>
		</li>);
	}

	return <div id="uuendus" className="container">
		<h2>Oskused</h2>
		<ul>{menuItems}</ul>
	</div>;
}


function NewUsers(props) {
	const world = worldId[props.metadata.world];
	const numberOfColumns = props.newUsers.length >= 8 ? 2 : 1;
	const numberOfRows = Math.ceil(props.newUsers.length / numberOfColumns);

	function column(columnIndex) {
		const rows = [];
		for(let i = columnIndex * numberOfRows; i < columnIndex * numberOfRows + numberOfRows; i++) {
			const user = props.users[props.newUsers[i]];
			if(user) {
				rows.push(<tr key={i}>
					<td className="number"><b>{i + 1}</b></td>
					<td className="number">{user.rank + '.'}</td>
					<td><a
						href={`http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`}
						target="blank">{user.user}</a></td>
					<td className="number"><b>{user.value}</b></td>
				</tr>);
			}
		}

		return <table>
			<thead>
			<tr className="tume" style={{ fontWeight: 'bold' }}>
				<td className="number">&nbsp;</td>
				<td className="number">Koht edetabelis</td>
				<td>Kasutajanimi</td>
				<td className="number">Kuulsus</td>
			</tr>
			</thead>
			<tbody>
			<tr>{rows}</tr>
			</tbody>
		</table>;
	}

	return <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
		{column(0)}
		{numberOfColumns === 2 ? column(1) : undefined}
	</div>;
}


function FameDiff(props) {
	const world = worldId[props.metadata.world];
	const rows = [];
	for(let i = 0; i < props.changedUsers.length; i++) {
		const user = props.users[props.changedUsers[i]];
		rows.push(<tr key={i}>
			<td className="number"><b>{i + 1}</b></td>
			<td className="number">{user.rank + '.'}</td>
			<td><a
				href={`http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`}
				target="blank">{user.user}</a></td>
			<td className="number"><b>{user.value}</b></td>
			<td className="number"
			    style={{ color: user.normalizedRankDiff > 0 ? 'green'
					    : (user.normalizedRankDiff < 0 ? 'red' : undefined) }}>
				<b>{user.normalizedRankDiff}</b> ({user.rankDiff})</td>
			<td className="number"><b>{user.valueDiff}</b></td>
		</tr>);
	}

	return <table className="container" style={{ margin: '2px' }}>
		<thead>
		<tr>
			<th colSpan="6">{props.caption}</th>
		</tr>
		<tr className="tume" style={{ fontWeight: 'bold' }}>
			<td className="number">..</td>
			<td className="number">Koht edetabelis</td>
			<td>Kasutajanimi</td>
			<td className="number">Kuulsus</td>
			<td className="number">Koha muutus</td>
			<td className="number">Kuulsuse muutus</td>
		</tr>
		</thead>
		<tbody>
		<tr>{rows}</tr>
		</tbody>
	</table>;
}


function SkillDiff(props) {
	const world = worldId[props.metadata.world];
	const rows = [];
	for(let i = 0; i < props.changedUsers.length; i++) {
		const user = props.users[props.changedUsers[i]];
		rows.push(<tr key={i}>
			<td className="number"><b>{i + 1}</b></td>
			<td className="number">{user.rank + '.'}</td>
			<td><a
				href={`http://www.crime.ee/index.php?a=11&m=${world}&k=${encodeURIComponent(user.user)}`}
				target="blank">{user.user}</a></td>
			<td className="number"><b>{user.value}</b></td>
			<td className="number"
			    style={{ color: user.normalizedRankDiff > 0 ? 'green'
					    : (user.normalizedRankDiff < 0 ? 'red' : undefined) }}>
				<b>{user.normalizedRankDiff}</b> ({user.rankDiff})</td>
			<td className="number"><b>{props.user.valueDiff.toFixed(props.metadata.skill === 'kaklemine' ? 2 : 0)}</b></td>
			{props.metadata.skill !== 'kaklemine'
			&& <td className="number"><b>{calculateFame({[props.metadata.skill]: user.value})
			- calculateFame({ [props.metadata.skill]: user.value - user.valueDiff })}</b></td>}
		</tr>);
	}

	return <table>
		<thead>
		<tr className="tume" style={{ fontWeight: 'bold' }}>
			<td className="number">..</td>
			<td className="number">Koht edetabelis</td>
			<td>Kasutajanimi</td>
			<td className="number">Level</td>
			<td className="number">Koha muutus</td>
			<td className="number">Leveli muutus</td>
			{props.metadata.skill !== 'kaklemine' && <td className="number">Kuulsuse muutus</td>}
		</tr>
		</thead>
		<tbody>
		<tr>{rows}</tr>
		</tbody>
	</table>;
}


function Index(props) {
	const world = worldId[props.metadata.world];

	return <html>
	<head>
		<meta charSet="utf-8"/>
		<title>Kuulsuse muutumise statistika</title>
		<base href={config.appUrl + '/'}/>
		<link rel="icon" href="http://crime.ee/favicon.ico"/>
		<link rel="stylesheet" href="http://valge.crime.ee/css/layout/wide.css?2.7"/>
		<link rel="stylesheet" href="http://valge.crime.ee/css/colors/crime.css?2.7"/>
		<link rel="stylesheet" href="http://valge.crime.ee/css/fonts/default.css?2.7"/>
		<style>{`
			td,th{vertical-align:top}
			td.number{text-align:right}
			.tume td, .tstyle th {font-size:0.73em} /* ugly things are ugly */
			#uuendus ul {margin:10px 20px}
			.tume td {
			background-color: #8e603f;
			background-image: url(http://crime.ee/pic/cont-head-gradient.png);
			background-size: 100% 100%;
		}`}</style>
	</head>
	<body>
	<div id="wrap">
		<div id="header">
			<p>{world ? `${worldName[world]} maailm` : ''}</p>
			<ul style={{ top: '4px' }}>
				<li style={{ backgroundColor: 'white' }}>
					<a href={buildUrl(props.metadata, { world: 'valge' })}>Valge maailm</a>
				</li>
				<li style={{ backgroundColor: 'blue' }}>
					<a href={buildUrl(props.metadata, { world: 'sinine' })}>Sinine maailm</a>
				</li>
				<li style={{ backgroundColor: 'green' }}>
					<a href={buildUrl(props.metadata, { world: 'roheline' })}>Roheline maailm</a>
				</li>
				<li style={{ backgroundColor: 'black' }}>
					<a href={buildUrl(props.metadata, { world: 'must' })}>Must maailm</a>
				</li>
			</ul>
			<ul>
				<li><a href={buildUrl(props.metadata, { period: '1m' })}>Eelmine kuu</a></li>
				<li><a href={buildUrl(props.metadata, { period: '0m' })}>See kuu</a></li>
				<li><a href={buildUrl(props.metadata, { period: '1w' })}>Eelmine nädal</a></li>
				<li><a href={buildUrl(props.metadata, { period: '0w' })}>See nädal</a></li>
				<li><a href={buildUrl(props.metadata, { period: '1d' })}>Üleeile</a></li>
				<li className="icon special"><a href={buildUrl(props.metadata, { period: '0d' })}>Eile</a></li>
			</ul>
		</div>
		<div id="info">
			&nbsp;
		</div>
		{Array.isArray(props.children) ? props.children[0] : props.children}
	</div>
	{Array.isArray(props.children) ? props.children[1] : undefined}
	</body>
	</html>;
}


export default function(metadata, period, stats) {
	if('world' in metadata) {
		if(stats.startTime === null || stats.endTable === null) {
			return renderToString(<Index metadata={metadata}>
				<div>
					<div id="sisu">
						<div className="container">
							<h2>Tabelid selle perioodi jaoks puuduvad</h2>
							<div style={{ width: '300px', margin: 'auto', textAlign: 'center' }}>
								That's it
							</div>
						</div>
					</div>
					<MetaData metadata={metadata} period={period} stats={stats} />
					<SkillMenu metadata={metadata}/>
				</div>
			</Index>);
		}

		const skill = skillId[metadata.skill];
		const { users, changedUsers, newUsers } = stats;
		const comparator = (v1, v2) => users[v2].valueDiff - users[v1].valueDiff || users[v1].rank - users[v2].rank;

		if(skill === 0) {
			let millionIndex, halfMillionIndex;
			for(millionIndex = 0;
			    millionIndex < changedUsers.length && users[changedUsers[millionIndex]].value >= 1000000;
			    millionIndex++);
			for(halfMillionIndex = millionIndex;
			    halfMillionIndex < changedUsers.length && users[changedUsers[halfMillionIndex]].value >= 500000;
			    halfMillionIndex++);

			const group3 = changedUsers.slice(0, millionIndex);
			const group2 = changedUsers.slice(millionIndex, halfMillionIndex);
			const group1 = changedUsers.slice(halfMillionIndex);
			group1.sort(comparator);
			group2.sort(comparator);
			group3.sort(comparator);

			return renderToString(<Index metadata={metadata}>
				<div>
					<div id="sisu">
						<div className="container">
							<h2>Uued kasutajad</h2>
							<NewUsers metadata={metadata} users={users} newUsers={newUsers}/>
						</div>
					</div>
					<MetaData metadata={metadata} period={period} stats={stats} />
					<SkillMenu metadata={metadata}/>
				</div>
				<div style={{ clear: 'both', margin: 'auto', display: 'flex', justifyContent: 'center' }}>
					<FameDiff metadata={metadata} caption="Alla 500 000" users={users} changedUsers={group1}/>
					<FameDiff metadata={metadata} caption="500 000 - 999 999" users={users} changedUsers={group2}/>
					<FameDiff metadata={metadata} caption="1 000 000 või rohkem" users={users} changedUsers={group3}/>
				</div>
			</Index>);
		} else {
			changedUsers.sort(comparator);
			return renderToString(<Index metadata={metadata}>
				<div>
					<div id="sisu">
						<div className="container">
							<h2>{skillName[skill].charAt(0).toUpperCase() + skillName[skill].slice(1)}</h2>
							<SkillDiff metadata={metadata} users={users} changedUsers={changedUsers}/>
						</div>
					</div>
					<MetaData metadata={metadata} period={period} stats={stats}/>
					<SkillMenu metadata={metadata}/>
				</div>
			</Index>);
		}
	} else {
		return renderToString(<Index metadata={metadata}>
			<Home metadata={metadata}/>
		</Index>);
	}
};
