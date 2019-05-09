// widgets type 对应值
export const widgetTypes = {
	h2h: 'widgets.matchhead2head',
	table: 'widgets.livetable',
	lineups: 'widgets.matchlineups',
	commentary: 'widgets.matchcommentary',
	// news: 'widgets.news',
	ranking: 'widgets.tennisranking',
	topLists: 'widgets.toplists',
	// playerInfo: 'widgets.playerinfo',
	leagueTable: 'widgets.livetable'
};

export const typeList = {
	football: [{
		label: 'H2H',
		type: 'h2h'
	}, {
		label: 'Table',
		type: 'table'
	}, {
		label: 'Lineups',
		type: 'lineups'
	}, {
		label: 'Commentary',
		type: 'commentary'
	}],
	basketball: [{
		label: 'H2H',
		type: 'h2h'
	}, {
		label: 'Table',
		type: 'table'
	}],
	tennis: [{
		label: 'H2H',
		type: 'h2h'
	}, {
		label: 'Ranking',
		type: 'ranking'
	}],
	handball: [{
		label: 'H2H',
		type: 'h2h'
	}, {
		label: 'Top Lists',
		type: 'topLists'
	// }, {
	// 	label: 'Player Info',
	// 	type: 'playerInfo'
	}, {
		label: 'League Table',
		type: 'leagueTable'
	}],
	darts: [{
		label: 'H2H',
		type: 'h2h'
	}, {
		label: 'Top Lists',
		type: 'topLists'
	// }, {
	// 	label: 'Player Info',
	// 	type: 'playerInfo'
	}]
};
