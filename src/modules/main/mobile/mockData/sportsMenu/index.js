import mockjax from 'mock';

const data1 = {
	bizCode: 10000,
	message: '0#0',
	data: [
		{
			id: 'sr:sport:1',
			name: 'Football',
			eventSize: 624,
			categories:
			[
				{
					id: 'sr:category:257',
					name: 'Albania',
					eventSize: 2,
					tournaments: [
						{
							id: 'sr:tournament:720',
							name: 'Kategoria Superiore',
							eventSize: 2
						}
					]
				},
				{
					id: 'sr:category:48',
					name: 'Argentina',
					eventSize: 9,
					tournaments: [
					{ id: 'sr:tournament:703', name: 'Primera B Nacional', eventSize: 2 },
					{ id: 'sr:tournament:155', name: 'Primera Division', eventSize: 3 },
					{ id: 'sr:tournament:1347', name: 'Primera B', eventSize: 4 }] },
				{
					id: 'sr:category:296',
					name: 'Armenia',
					eventSize: 4,
					tournaments: [
					{ id: 'sr:tournament:672', name: 'First League', eventSize: 4 }] },
				{ id: 'sr:category:34',
					name: 'Australia',
					eventSize: 2,
					tournaments: [
						{
							id: 'sr:tournament:136',
							name: 'A-League',
							eventSize: 2 }] },
				{
					id: 'sr:category:17',
					name: 'Austria',
					eventSize: 8,
					tournaments: [
						{
							id: 'sr:tournament:45',
							name: 'Bundesliga',
							eventSize: 5
						},
						{
							id: 'sr:tournament:135', name: 'Erste Liga', eventSize: 3
						}]
				},
				{
					id: 'sr:category:33',
					name: 'Belgium',
					eventSize: 8,
					tournaments: [
						{ id: 'sr:tournament:38',
							name: 'First Division A',
							eventSize: 8 }]
				},
				{
					id: 'sr:category:379',
					name: 'Bolivia',
					eventSize: 1,
					tournaments:
					[{
						id: 'sr:tournament:866',
						name: 'Liga Profesional Bolivia',
						eventSize: 1 }] }, { id: 'sr:category:13',
							name: 'Brazil',
							eventSize: 21,
							tournaments: [
							{ id: 'sr:tournament:92', name: 'Carioca', eventSize: 6 }, { id: 'sr:tournament:377', name: 'Gaucho', eventSize: 6 }, { id: 'sr:tournament:379', name: 'Mineiro', eventSize: 6 },
								{
									id: 'sr:tournament:372',
									name: 'Paulista, Serie A1',
									eventSize: 3 }]
						},
				{
					id: 'sr:category:78',
					name: 'Bulgaria',
					eventSize: 16,
					tournaments: [
						{
							id: 'sr:tournament:247',
							name: 'First Professional League',
							eventSize: 16
						}]
				},
				{
					id: 'sr:category:274',
					name: 'Colombia',
					eventSize: 9,
					tournaments: [
						{
							id: 'sr:tournament:241',
							name: 'Primera A',
							eventSize: 9 }] },
				{ id: 'sr:category:289',
					name: 'Costa Rica',
					eventSize: 2,
					tournaments: [
					{ id: 'sr:tournament:84', name: 'Primera Division', eventSize: 2 }] },
				{ id: 'sr:category:14', name: 'Croatia', eventSize: 3, tournaments: [{ id: 'sr:tournament:170', name: '1. HNL', eventSize: 3 }] }, { id: 'sr:category:102', name: 'Cyprus', eventSize: 3, tournaments: [{ id: 'sr:tournament:315', name: 'Cyprus Cup', eventSize: 3 }] },
				{ id: 'sr:category:18',
					name: 'Czech Republic',
					eventSize: 9,
					tournaments: [{ id: 'sr:tournament:172', name: '1. Liga', eventSize: 7 }, { id: 'sr:tournament:282', name: 'Cup', eventSize: 2 }] }, { id: 'sr:category:8', name: 'Denmark', eventSize: 9, tournaments: [{ id: 'sr:tournament:39', name: 'Superligaen', eventSize: 9 }] }, { id: 'sr:category:165',
						name: 'Ecuador',
						eventSize: 2,
						tournaments: [
						{ id: 'sr:tournament:240', name: 'Serie A', eventSize: 2 }] }, { id: 'sr:category:305', name: 'Egypt', eventSize: 7, tournaments: [{ id: 'sr:tournament:808', name: 'Premier League', eventSize: 7 }] },
				{
					id: 'sr:category:1',
					name: 'England',
					eventSize: 90,
					tournaments: [{ id: 'sr:tournament:17', name: 'Premier League', eventSize: 15 }, { id: 'sr:tournament:18', name: 'Championship', eventSize: 24 }, { id: 'sr:tournament:24', name: 'League One', eventSize: 13 }, { id: 'sr:tournament:25', name: 'League Two', eventSize: 16 }, { id: 'sr:tournament:173', name: 'National League', eventSize: 17 }, { id: 'sr:tournament:19', name: 'FA Cup', eventSize: 4 }, { id: 'sr:tournament:334', name: 'Football League Trophy', eventSize: 1 }] },
				{
					id: 'sr:category:19', name: 'Finland', eventSize: 6, tournaments: [{ id: 'sr:tournament:41', name: 'Veikkausliiga', eventSize: 6 }] },
				{
					id: 'sr:category:7',
					name: 'France',
					eventSize: 23,
					tournaments: [
					{ id: 'sr:tournament:34', name: 'Ligue 1', eventSize: 21 },
					{ id: 'sr:tournament:182', name: 'Ligue 2', eventSize: 1 }, { id: 'sr:tournament:333', name: 'Coupe de la Ligue', eventSize: 1 }] },
				{
					id: 'sr:category:270', name: 'Georgia', eventSize: 3, tournaments: [{ id: 'sr:tournament:704', name: 'National League', eventSize: 3 }] }, { id: 'sr:category:30', name: 'Germany', eventSize: 50, tournaments: [{ id: 'sr:tournament:35', name: 'Bundesliga', eventSize: 18 }, { id: 'sr:tournament:44', name: '2nd Bundesliga', eventSize: 10 }, { id: 'sr:tournament:491', name: '3rd Liga', eventSize: 20 }, { id: 'sr:tournament:217', name: 'DFB Pokal', eventSize: 2 }] }, { id: 'sr:category:67', name: 'Greece', eventSize: 8, tournaments: [{ id: 'sr:tournament:185', name: 'Super League', eventSize: 8 }] }, { id: 'sr:category:352', name: 'India', eventSize: 2, tournaments: [{ id: 'sr:tournament:848', name: 'I-League', eventSize: 2 }] }, { id: 'sr:category:4', name: 'International', eventSize: 60, tournaments: [{ id: 'sr:tournament:16', name: 'World Cup', eventSize: 48 }, { id: 'sr:tournament:411', name: 'Algarve Cup Women', eventSize: 6 }, { id: 'sr:tournament:1018', name: 'Cyprus Women Cup', eventSize: 6 }] }, { id: 'sr:category:393',
						name: 'International Clubs',
						eventSize: 51,
						tournaments: [
							{ id: 'sr:tournament:7', name: 'UEFA Champions League', eventSize: 8 }, { id: 'sr:tournament:679', name: 'UEFA Europa League', eventSize: 8 }, { id: 'sr:tournament:463', name: 'AFC Champions League', eventSize: 16 }, { id: 'sr:tournament:668', name: 'AFC Cup', eventSize: 14 }, { id: 'sr:tournament:498', name: 'CONCACAF CL', eventSize: 4 }, { id: 'sr:tournament:853', name: 'Club Friendly Games', eventSize: 1 }] },
				{
					id: 'sr:category:51', name: 'Ireland', eventSize: 1, tournaments: [{ id: 'sr:tournament:192', name: 'Premier Division', eventSize: 1 }] }, { id: 'sr:category:66', name: 'Israel', eventSize: 1, tournaments: [{ id: 'sr:tournament:266', name: 'Premier League', eventSize: 1 }] },
				{ id: 'sr:category:31',
					name: 'Italy',
					eventSize: 33,
					tournaments: [
					{ id: 'sr:tournament:23', name: 'Serie A', eventSize: 21 },
				{ id: 'sr:tournament:53', name: 'Serie B', eventSize: 12 }] },
				{
					id: 'sr:category:502', name: 'Jamaica', eventSize: 1, tournaments: [{ id: 'sr:tournament:1892', name: 'Premier League', eventSize: 1 }] },
				{
					id: 'sr:category:52', name: 'Japan', eventSize: 22, tournaments: [{ id: 'sr:tournament:196', name: 'J.League', eventSize: 9 }, { id: 'sr:tournament:402', name: 'J.League 2', eventSize: 11 }, { id: 'sr:tournament:101', name: 'J. League Cup', eventSize: 2 }] },
				{
					id: 'sr:category:134', name: 'Malta', eventSize: 1, tournaments: [{ id: 'sr:tournament:629', name: 'Premier League', eventSize: 1 }] },
				{
					id: 'sr:category:12', name: 'Mexico', eventSize: 9, tournaments: [{ id: 'sr:tournament:352', name: 'Primera Division', eventSize: 9 }] }, { id: 'sr:category:35', name: 'Netherlands', eventSize: 12, tournaments: [{ id: 'sr:tournament:37', name: 'Eredivisie', eventSize: 9 }, { id: 'sr:tournament:131', name: 'Eerste Divisie', eventSize: 3 }] }, { id: 'sr:category:130', name: 'Northern Ireland', eventSize: 2, tournaments: [{ id: 'sr:tournament:200', name: 'JJB Sports Premiership', eventSize: 2 }] }, { id: 'sr:category:5', name: 'Norway', eventSize: 11, tournaments: [{ id: 'sr:tournament:20', name: 'Eliteserien', eventSize: 8 }, { id: 'sr:tournament:22', name: '1st Division', eventSize: 3 }] }, { id: 'sr:category:280', name: 'Paraguay', eventSize: 1, tournaments: [{ id: 'sr:tournament:693', name: 'Primera Division', eventSize: 1 }] }, { id: 'sr:category:47', name: 'Poland', eventSize: 17, tournaments: [{ id: 'sr:tournament:202', name: 'Ekstraklasa', eventSize: 9 }, { id: 'sr:tournament:229', name: 'I Liga', eventSize: 8 }] }, { id: 'sr:category:44', name: 'Portugal', eventSize: 1, tournaments: [{ id: 'sr:tournament:238', name: 'Primeira Liga', eventSize: 1 }] }, { id: 'sr:category:77', name: 'Romania', eventSize: 6, tournaments: [{ id: 'sr:tournament:152', name: 'Liga I', eventSize: 6 }] }, { id: 'sr:category:21', name: 'Russia', eventSize: 19, tournaments: [{ id: 'sr:tournament:203', name: 'Premier League', eventSize: 8 }, { id: 'sr:tournament:204', name: 'Football National League', eventSize: 11 }] }, { id: 'sr:category:310', name: 'Saudi Arabia', eventSize: 4, tournaments: [{ id: 'sr:tournament:955', name: 'Saudi Prof. League', eventSize: 4 }] }, { id: 'sr:category:22', name: 'Scotland', eventSize: 28, tournaments: [{ id: 'sr:tournament:36', name: 'Premiership', eventSize: 13 }, { id: 'sr:tournament:207', name: 'League One', eventSize: 8 }, { id: 'sr:tournament:206', name: 'Championship', eventSize: 7 }] }, { id: 'sr:category:32', name: 'Spain', eventSize: 22, tournaments: [{ id: 'sr:tournament:8', name: 'LaLiga', eventSize: 21 }, { id: 'sr:tournament:329', name: 'Copa del Rey', eventSize: 1 }] }, { id: 'sr:category:9', name: 'Sweden', eventSize: 9, tournaments: [{ id: 'sr:tournament:40', name: 'Allsvenskan', eventSize: 4 }, { id: 'sr:tournament:46', name: 'Superettan', eventSize: 5 }] }, { id: 'sr:category:25', name: 'Switzerland', eventSize: 2, tournaments: [{ id: 'sr:tournament:216', name: 'Challenge League', eventSize: 2 }] }, { id: 'sr:category:46', name: 'Turkey', eventSize: 1, tournaments: [{ id: 'sr:tournament:52', name: 'Super Lig', eventSize: 1 }] }, { id: 'sr:category:86', name: 'Ukraine', eventSize: 1, tournaments: [{ id: 'sr:tournament:218', name: 'Premier League', eventSize: 1 }] }, { id: 'sr:category:26', name: 'USA', eventSize: 9, tournaments: [{ id: 'sr:tournament:242', name: 'Major League Soccer', eventSize: 9 }] }, { id: 'sr:category:281', name: 'Venezuela', eventSize: 1, tournaments: [{ id: 'sr:tournament:231', name: 'Primera Division', eventSize: 1 }] }, { id: 'sr:category:131', name: 'Wales', eventSize: 2, tournaments: [{ id: 'sr:tournament:388', name: 'FAW Welsh Cup', eventSize: 2 }] }]
		},
		{
			id: 'sr:sport:2',
			name: 'Basketball',
			eventSize: 59,
			categories: [
				{ id: 'sr:category:264',
					name: 'Argentina',
					eventSize: 3,
					tournaments: [
						{ id: 'sr:tournament:1680',
							name: 'LNB',
							eventSize: 3 }] },
				{ id: 'sr:category:113',
					name: 'Australia',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:1524',
							name: 'NBL',
							eventSize: 1 }] },
				{
					id: 'sr:category:170',
					name: 'Austria',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:297', name: 'ABL', eventSize: 1 }] },
				{
					id: 'sr:category:154',
					name: 'Czech Republic',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:250',
							name: 'NBL',
							eventSize: 1 }] },
				{
					id: 'sr:category:244',
					name: 'Denmark',
					eventSize: 1,
					tournaments: [
						{ id: 'sr:tournament:843',
							name: 'Basketligaen',
							eventSize: 1 }] },
				{ id: 'sr:category:110',
					name: 'France',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:156', name: 'Pro A', eventSize: 1 }] }, { id: 'sr:category:108', name: 'Greece', eventSize: 6, tournaments: [{ id: 'sr:tournament:304', name: 'A1', eventSize: 6 }] },
				{
					id: 'sr:category:546', name: 'Iceland', eventSize: 2, tournaments: [{ id: 'sr:tournament:14455', name: 'Urvalsdeild', eventSize: 2 }] }, { id: 'sr:category:780',
						name: 'Indonesia',
						eventSize: 1,
						tournaments: [{
							id: 'sr:tournament:14862', name: 'IBL', eventSize: 1 }] },
				{
					id: 'sr:category:103',
					name: 'International',
					eventSize: 18,
					tournaments: [{ id: 'sr:tournament:14051', name: 'Champions League', eventSize: 2 }, { id: 'sr:tournament:141', name: 'Eurocup', eventSize: 4 }, { id: 'sr:tournament:138', name: 'Euroleague', eventSize: 8 }, { id: 'sr:tournament:2370', name: 'Alpe Adria Cup', eventSize: 1 },
					{ id: 'sr:tournament:582', name: 'Baltic Basketball League', eventSize: 1 }, { id: 'sr:tournament:235', name: 'Liga ABA', eventSize: 2 }] },
				{
					id: 'sr:category:188', name: 'Israel', eventSize: 2, tournaments: [{ id: 'sr:tournament:1197', name: 'Super League', eventSize: 2 }] }, { id: 'sr:category:107', name: 'Italy', eventSize: 1, tournaments: [{ id: 'sr:tournament:262', name: 'Serie A', eventSize: 1 }] }, { id: 'sr:category:483', name: 'Japan', eventSize: 1, tournaments: [{ id: 'sr:tournament:1502', name: 'B.League ', eventSize: 1 }] },
				{
					id: 'sr:category:539', name: 'Philippines', eventSize: 2, tournaments: [{ id: 'sr:tournament:1956', name: 'PBA, Philippine Cup', eventSize: 2 }] }, { id: 'sr:category:284', name: 'Poland', eventSize: 2, tournaments: [{ id: 'sr:tournament:263', name: 'PLK', eventSize: 2 }] },
				{
					id: 'sr:category:287', name: 'Portugal', eventSize: 1, tournaments: [{ id: 'sr:tournament:1926', name: 'LPB', eventSize: 1 }] }, { id: 'sr:category:375', name: 'Republic of Korea', eventSize: 1, tournaments: [{ id: 'sr:tournament:2402', name: 'WKBL', eventSize: 1 }] }, { id: 'sr:category:112', name: 'Turkey', eventSize: 1, tournaments: [{ id: 'sr:tournament:519', name: 'TBSL', eventSize: 1 }] }, { id: 'sr:category:15', name: 'USA', eventSize: 13, tournaments: [{ id: 'sr:tournament:132', name: 'NBA', eventSize: 5 }, { id: 'sr:tournament:648', name: 'NCAA Men', eventSize: 8 }] }]
		},
		{
			id: 'sr:sport:5',
			name: 'Tennis',
			eventSize: 62,
			categories: [
				{ id: 'sr:category:72',
					name: 'Challenger',
					eventSize: 30,
					tournaments: [
						{
							id: 'sr:tournament:4149',
							name: 'ATP Challenger Santiago, Chile Men Singles',
							eventSize: 16 },
						{
							id: 'sr:tournament:13487',
							name: 'ATP Challenger Zhuhai, China Men Double',
							eventSize: 7 },
						{
							id: 'sr:tournament:13485',
							name: 'ATP Challenger Zhuhai, China Men Singles',
							eventSize: 7 }] },
				{

					id: 'sr:category:785',
					name: 'ITF Men',
					eventSize: 5,
					tournaments: [
						{ id: 'sr:tournament:14939',
							name: 'ITF India F2, Men Doubles',
							eventSize: 1
						},
						{
							id: 'sr:tournament:17620',
							name: 'ITF Israel F1, Men Singles',
							eventSize: 2 },
						{ id: 'sr:tournament:18986',
							name: 'ITF Russia F2, Men Singles',
							eventSize: 2 }] },
				{ id: 'sr:category:213',
					name: 'ITF Women',
					eventSize: 3,
					tournaments: [{
						id: 'sr:tournament:22050',
						name: 'ITF Italy 04A, Women Singles',
						eventSize: 3 }] },
				{ id: 'sr:category:6',
					name: 'WTA',
					eventSize: 24,
					tournaments: [{ id: 'sr:tournament:4589', name: 'WTA Indian Wells, USA Women Singles', eventSize: 24 }] }]
		},
	]
};
const data2 = {
	bizCode: 10000,
	message: '0#0',
	data: [
		{
			id: 'sr:sport:2',
			name: 'Basketball',
			eventSize: 59,
			categories: [
				{ id: 'sr:category:264',
					name: 'Argentina',
					eventSize: 3,
					tournaments: [
						{ id: 'sr:tournament:1680',
							name: 'LNB',
							eventSize: 3 }] },
				{ id: 'sr:category:113',
					name: 'Australia',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:1524',
							name: 'NBL',
							eventSize: 1 }] },
				{
					id: 'sr:category:170',
					name: 'Austria',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:297', name: 'ABL', eventSize: 1 }] },
				{
					id: 'sr:category:154',
					name: 'Czech Republic',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:250',
							name: 'NBL',
							eventSize: 1 }] },
				{
					id: 'sr:category:244',
					name: 'Denmark',
					eventSize: 1,
					tournaments: [
						{ id: 'sr:tournament:843',
							name: 'Basketligaen',
							eventSize: 1 }] },
				{ id: 'sr:category:110',
					name: 'France',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:156', name: 'Pro A', eventSize: 1 }] }, { id: 'sr:category:108', name: 'Greece', eventSize: 6, tournaments: [{ id: 'sr:tournament:304', name: 'A1', eventSize: 6 }] },
				{
					id: 'sr:category:546', name: 'Iceland', eventSize: 2, tournaments: [{ id: 'sr:tournament:14455', name: 'Urvalsdeild', eventSize: 2 }] }, { id: 'sr:category:780',
						name: 'Indonesia',
						eventSize: 1,
						tournaments: [{
							id: 'sr:tournament:14862', name: 'IBL', eventSize: 1 }] },
				{
					id: 'sr:category:103',
					name: 'International',
					eventSize: 18,
					tournaments: [{ id: 'sr:tournament:14051', name: 'Champions League', eventSize: 2 }, { id: 'sr:tournament:141', name: 'Eurocup', eventSize: 4 }, { id: 'sr:tournament:138', name: 'Euroleague', eventSize: 8 }, { id: 'sr:tournament:2370', name: 'Alpe Adria Cup', eventSize: 1 },
					{ id: 'sr:tournament:582', name: 'Baltic Basketball League', eventSize: 1 }, { id: 'sr:tournament:235', name: 'Liga ABA', eventSize: 2 }] },
				{
					id: 'sr:category:188', name: 'Israel', eventSize: 2, tournaments: [{ id: 'sr:tournament:1197', name: 'Super League', eventSize: 2 }] }, { id: 'sr:category:107', name: 'Italy', eventSize: 1, tournaments: [{ id: 'sr:tournament:262', name: 'Serie A', eventSize: 1 }] }, { id: 'sr:category:483', name: 'Japan', eventSize: 1, tournaments: [{ id: 'sr:tournament:1502', name: 'B.League ', eventSize: 1 }] },
				{
					id: 'sr:category:539', name: 'Philippines', eventSize: 2, tournaments: [{ id: 'sr:tournament:1956', name: 'PBA, Philippine Cup', eventSize: 2 }] }, { id: 'sr:category:284', name: 'Poland', eventSize: 2, tournaments: [{ id: 'sr:tournament:263', name: 'PLK', eventSize: 2 }] },
				{
					id: 'sr:category:287', name: 'Portugal', eventSize: 1, tournaments: [{ id: 'sr:tournament:1926', name: 'LPB', eventSize: 1 }] }, { id: 'sr:category:375', name: 'Republic of Korea', eventSize: 1, tournaments: [{ id: 'sr:tournament:2402', name: 'WKBL', eventSize: 1 }] }, { id: 'sr:category:112', name: 'Turkey', eventSize: 1, tournaments: [{ id: 'sr:tournament:519', name: 'TBSL', eventSize: 1 }] }, { id: 'sr:category:15', name: 'USA', eventSize: 13, tournaments: [{ id: 'sr:tournament:132', name: 'NBA', eventSize: 5 }, { id: 'sr:tournament:648', name: 'NCAA Men', eventSize: 8 }] }] },

	]
};
const data3 = {
	bizCode: 10000,
	message: '0#0',
	data: [{
		id: 'sr:sport:5',
		name: 'Tennis',
		eventSize: 62,
		categories: [
			{ id: 'sr:category:72',
				name: 'Challenger',
				eventSize: 30,
				tournaments: [
					{
						id: 'sr:tournament:4149',
						name: 'ATP Challenger Santiago, Chile Men Singles',
						eventSize: 16 },
					{
						id: 'sr:tournament:13487',
						name: 'ATP Challenger Zhuhai, China Men Double',
						eventSize: 7 },
					{
						id: 'sr:tournament:13485',
						name: 'ATP Challenger Zhuhai, China Men Singles',
						eventSize: 7 }] },
			{

				id: 'sr:category:785',
				name: 'ITF Men',
				eventSize: 5,
				tournaments: [
					{ id: 'sr:tournament:14939',
						name: 'ITF India F2, Men Doubles',
						eventSize: 1
					},
					{
						id: 'sr:tournament:17620',
						name: 'ITF Israel F1, Men Singles',
						eventSize: 2 },
					{ id: 'sr:tournament:18986',
						name: 'ITF Russia F2, Men Singles',
						eventSize: 2 }] },
			{ id: 'sr:category:213',
				name: 'ITF Women',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:22050',
					name: 'ITF Italy 04A, Women Singles',
					eventSize: 3 }] },
			{ id: 'sr:category:6',
				name: 'WTA',
				eventSize: 24,
				tournaments: [{ id: 'sr:tournament:4589', name: 'WTA Indian Wells, USA Women Singles', eventSize: 24 }] }]
	},
	]
};
const data4 = {
	bizCode: 10000,
	message: '0#0',
	data: [{ id: 'sr:sport:12',
		name: 'Rugby',
		eventSize: 22,
		categories: [{ id: 'sr:category:83',
			name: 'Rugby League',
			eventSize: 8,
			tournaments: [{ id: 'sr:tournament:294', name: 'NRL', eventSize: 8 }] }, { id: 'sr:category:82',
				name: 'Rugby Union',
				eventSize: 14,
				tournaments: [{ id: 'sr:tournament:422', name: 'Super Rugby', eventSize: 7 },
					{
						id: 'sr:tournament:401', name: 'European Cup', eventSize: 4 },
						{ id: 'sr:tournament:423', name: 'Six Nations', eventSize: 3 }]
			}]
	},
	]
};
const data5 = {
	bizCode: 10000,
	message: '0#0',
	data:
	[
		{
			id: 'sr:sport:21',
			name: 'Cricket',
			eventSize: 4,
			categories: [
				{ id: 'sr:category:491',
					name: 'Australia',
					eventSize: 1,
					tournaments: [
						{
							id: 'sr:tournament:21568',
							name: 'Sheffield Shield',
							eventSize: 1
						}
					]
				},
				{
					id: 'sr:category:105',
					name: 'International',
					eventSize: 1,
					tournaments: [{
						id: 'sr:tournament:15550',
						name: 'ODI Series New Zealand vs. England',
						eventSize: 1
					}]
				},
				{ id: 'sr:category:848',
					name: 'Pakistan',
					eventSize: 2,
					tournaments: [{
						id: 'sr:tournament:14931',
						name: 'Pakistan Super League',
						eventSize: 2
					}]
				}]
		}
	] }
;

const matchData =
	{
		bizCode: 10000,
		message: '0#0',
		data: [
			{ id: 'sr:tournament:15387', name: 'ITF Greece F2, Men Singles', events: [{ eventId: 'sr:match:13937339', gameId: '5084', productStatus: '0#0', estimateStartTime: 1520409600000, status: 1, setScore: '0:0', gameScore: ['2:1'], pointScore: '40:30', period: '1', matchStatus: 'Set 1', homeTeamName: 'Authom, Maxime', awayTeamName: 'Egea, Franco Emanuel', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:15387', name: 'ITF Greece F2, Men Singles' }}}, totalMarketSize: 46, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.05', isActive: 1, desc: 'Home' }, { id: '5', odds: '6.50', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.04', isActive: 1, desc: 'Home' }, { id: '5', odds: '6.50', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.15', isActive: 1, desc: 'Home' }, { id: '5', odds: '4.10', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13957267', gameId: '2950', productStatus: '0#0', estimateStartTime: 1520409600000, status: 1, setScore: '0:0', gameScore: ['1:2'], pointScore: '15:30', period: '1', matchStatus: 'Set 1', homeTeamName: 'Johnson, Luke', awayTeamName: 'Dalla Valle, Enrico', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:15387', name: 'ITF Greece F2, Men Singles' }}}, totalMarketSize: 47, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '2.60', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.35', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '3.60', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.20', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '2.10', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.55', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Men', categoryId: 'sr:category:785' }, { id: 'sr:tournament:14941', name: 'ITF India F2, Men Singles', events: [{ eventId: 'sr:match:13972611', gameId: '6121', productStatus: '0#0', estimateStartTime: 1520408100000, status: 1, setScore: '0:0', gameScore: ['3:5'], pointScore: '0:0', period: '1', matchStatus: 'Set 1', homeTeamName: 'R Prabodh, Suraj', awayTeamName: 'Reinwein, Sami', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:14941', name: 'ITF India F2, Men Singles' }}}, totalMarketSize: 34, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '7.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.02', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '8.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.01', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '4.70', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.12', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Men', categoryId: 'sr:category:785' }, { id: 'sr:tournament:14975', name: 'ITF India 01A, Women Singles', events: [{ eventId: 'sr:match:13968143', gameId: '4684', productStatus: '0#0', estimateStartTime: 1520405700000, status: 1, setScore: '1:0', gameScore: ['7:5', '2:1'], pointScore: '0:0', period: '2', matchStatus: 'Set 2', homeTeamName: 'Luangnam, Nudnida', awayTeamName: 'Bhambri, Prerna', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:213', name: 'ITF Women', tournament: { id: 'sr:tournament:14975', name: 'ITF India 01A, Women Singles' }}}, totalMarketSize: 39, markets: [{ id: '186', product: 1, desc: 'Winner', status: 1, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.09', isActive: 1, desc: 'Home' }, { id: '5', odds: '5.25', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.07', isActive: 1, desc: 'Home', isWinning: 1, refundFactor: 0.0 }, { id: '5', odds: '5.75', isActive: 1, desc: 'Away', isWinning: 0, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 1, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.25', isActive: 1, desc: 'Home' }, { id: '5', odds: '3.20', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Women', categoryId: 'sr:category:213' }, { id: 'sr:tournament:20988', name: 'ITF Australia 08A, Women Doubles', events: [{ eventId: 'sr:match:13967263', gameId: '6110', productStatus: '0#0', estimateStartTime: 1520406000000, status: 1, setScore: '1:1', gameScore: ['7:6', '2:6', '0:0'], pointScore: '1:1', period: '3', matchStatus: 'Set 3', homeTeamName: 'Lorbergs G / Myers A', awayTeamName: 'Reix S / Smith A', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:213', name: 'ITF Women', tournament: { id: 'sr:tournament:20988', name: 'ITF Australia 08A, Women Doubles' }}}, totalMarketSize: 1, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '2.25', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.50', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.05', isActive: 0, desc: 'Home', isWinning: 1, refundFactor: 0.0 }, { id: '5', odds: '8.75', isActive: 1, desc: 'Away', isWinning: 0, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '8.50', isActive: 1, desc: 'Home', isWinning: 0, refundFactor: 0.0 }, { id: '5', odds: '1.01', isActive: 1, desc: 'Away', isWinning: 1, refundFactor: 0.0 }] }] }], categoryName: 'ITF Women', categoryId: 'sr:category:213' }, { id: 'sr:tournament:21296', name: 'ITF China 01A, Women Doubles', events: [{ eventId: 'sr:match:13969989', gameId: '6135', productStatus: '0#0', estimateStartTime: 1520409900000, status: 1, setScore: '0:0', gameScore: ['1:2'], pointScore: '0:0', period: '1', matchStatus: 'Set 1', homeTeamName: 'Raina A / Zimmermann K', awayTeamName: 'Jiang X / Tang Q', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:213', name: 'ITF Women', tournament: { id: 'sr:tournament:21296', name: 'ITF China 01A, Women Doubles' }}}, totalMarketSize: 36, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '3.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.18', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '3.60', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.20', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '3.05', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.30', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13968161', gameId: '6144', productStatus: '0#0', estimateStartTime: 1520410800000, status: 1, setScore: '0:0', gameScore: ['0:0'], pointScore: '40:0', period: '1', matchStatus: 'Set 1', homeTeamName: 'Cabrera L / Kumkhum L', awayTeamName: 'Blinkova A / Kerkhove L', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:213', name: 'ITF Women', tournament: { id: 'sr:tournament:21296', name: 'ITF China 01A, Women Doubles' }}}, totalMarketSize: 33, markets: [{ id: '186', product: 1, desc: 'Winner', status: 1, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.95', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.65', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 1, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.85', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 1, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '2.00', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.65', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Women', categoryId: 'sr:category:213' }, { id: 'sr:tournament:22044', name: 'ITF Greece 02A, Women Singles', events: [{ eventId: 'sr:match:13962697', gameId: '2576', productStatus: '0#0', estimateStartTime: 1520409600000, status: 1, setScore: '0:0', gameScore: ['3:1'], pointScore: '30:0', period: '1', matchStatus: 'Set 1', homeTeamName: 'Kolodziejova, Miriam', awayTeamName: 'Stosic, Aleksandra', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:213', name: 'ITF Women', tournament: { id: 'sr:tournament:22044', name: 'ITF Greece 02A, Women Singles' }}}, totalMarketSize: 45, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.01', isActive: 0, desc: 'Home' }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.01', isActive: 0, desc: 'Home' }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.01', isActive: 0, desc: 'Home' }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Women', categoryId: 'sr:category:213' }, { id: 'sr:tournament:17620', name: 'ITF Israel F1, Men Singles', events: [{ eventId: 'sr:match:13972873', gameId: '6139', productStatus: '0#0', estimateStartTime: 1520409600000, status: 1, setScore: '0:0', gameScore: ['1:0'], pointScore: 'AD:40', period: '1', matchStatus: 'Set 1', homeTeamName: 'Martineau, Matteo', awayTeamName: 'Vandenbulcke, Yannick', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:17620', name: 'ITF Israel F1, Men Singles' }}}, totalMarketSize: 47, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.55', isActive: 1, desc: 'Home' }, { id: '5', odds: '2.15', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.40', isActive: 1, desc: 'Home' }, { id: '5', odds: '2.55', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.70', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.90', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13973271', gameId: '6140', productStatus: '0#0', estimateStartTime: 1520409600000, status: 1, setScore: '0:0', gameScore: ['0:1'], pointScore: '30:0', period: '1', matchStatus: 'Set 1', homeTeamName: 'Musialek, Alexis', awayTeamName: 'Deviatiarov, Marat', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:17620', name: 'ITF Israel F1, Men Singles' }}}, totalMarketSize: 48, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.45', isActive: 1, desc: 'Home' }, { id: '5', odds: '2.40', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.60', isActive: 1, desc: 'Home' }, { id: '5', odds: '2.10', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.50', isActive: 1, desc: 'Home' }, { id: '5', odds: '2.25', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Men', categoryId: 'sr:category:785' }, { id: 'sr:tournament:18986', name: 'ITF Russia F2, Men Singles', events: [{ eventId: 'sr:match:13973103', gameId: '4419', productStatus: '0#0', estimateStartTime: 1520406000000, status: 1, setScore: '0:1', gameScore: ['4:6', '2:2'], pointScore: '40:AD', period: '2', matchStatus: 'Set 2', homeTeamName: 'Igoshin, Alexander', awayTeamName: 'Fufygin, Mikhail', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:18986', name: 'ITF Russia F2, Men Singles' }}}, totalMarketSize: 39, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '5.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.07', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '8.00', isActive: 1, desc: 'Home', isWinning: 0, refundFactor: 0.0 }, { id: '5', odds: '1.02', isActive: 1, desc: 'Away', isWinning: 1, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '3.50', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.22', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13958933', gameId: '4704', productStatus: '0#0', estimateStartTime: 1520406000000, status: 1, setScore: '1:0', gameScore: ['6:4', '5:5'], pointScore: '15:30', period: '2', matchStatus: 'Set 2', homeTeamName: 'Shyla, Yaraslav', awayTeamName: 'Skatov, Timofey', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:18986', name: 'ITF Russia F2, Men Singles' }}}, totalMarketSize: 34, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.22', isActive: 1, desc: 'Home' }, { id: '5', odds: '3.45', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.01', isActive: 1, desc: 'Home', isWinning: 1, refundFactor: 0.0 }, { id: '5', odds: '8.00', isActive: 1, desc: 'Away', isWinning: 0, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.85', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13968155', gameId: '6111', productStatus: '0#0', estimateStartTime: 1520406000000, status: 1, setScore: '1:0', gameScore: ['6:2', '3:3'], pointScore: '30:40', period: '2', matchStatus: 'Set 2', homeTeamName: 'Zhyrmont, Dzmitry', awayTeamName: 'Galiev, Bulat', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:18986', name: 'ITF Russia F2, Men Singles' }}}, totalMarketSize: 19, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '0.00', isActive: 0, desc: 'Home' }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.01', isActive: 0, desc: 'Home', isWinning: 1, refundFactor: 0.0 }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away', isWinning: 0, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 2, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.10', isActive: 1, desc: 'Home' }, { id: '5', odds: '5.00', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Men', categoryId: 'sr:category:785' }, { id: 'sr:tournament:17644', name: 'ITF Turkey F9, Men Singles', events: [{ eventId: 'sr:match:13960761', gameId: '6117', productStatus: '0#0', estimateStartTime: 1520407800000, status: 1, setScore: '0:1', gameScore: ['3:6', '0:1'], pointScore: '0:0', period: '2', matchStatus: 'Set 2', homeTeamName: 'Matos, Rafael', awayTeamName: 'Muller, Alexandre', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:17644', name: 'ITF Turkey F9, Men Singles' }}}, totalMarketSize: 44, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '5.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.06', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '8.50', isActive: 1, desc: 'Home', isWinning: 0, refundFactor: 0.0 }, { id: '5', odds: '1.01', isActive: 1, desc: 'Away', isWinning: 1, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '3.45', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.22', isActive: 1, desc: 'Away' }] }] }, { eventId: 'sr:match:13960759', gameId: '6119', productStatus: '0#0', estimateStartTime: 1520407800000, status: 1, setScore: '1:0', gameScore: ['6:2', '1:3'], pointScore: '0:0', period: '2', matchStatus: 'Set 2', homeTeamName: 'Safranek, Vaclav', awayTeamName: 'Ugo Carabelli, Camilo', sport: { id: 'sr:sport:5', name: 'Tennis', category: { id: 'sr:category:785', name: 'ITF Men', tournament: { id: 'sr:tournament:17644', name: 'ITF Turkey F9, Men Singles' }}}, totalMarketSize: 40, markets: [{ id: '186', product: 1, desc: 'Winner', status: 0, group: 'Main', marketGuide: 'Who is winner', title: '1,2', name: '2 Way', favourite: 1, outcomes: [{ id: '4', odds: '1.07', isActive: 1, desc: 'Home' }, { id: '5', odds: '5.75', isActive: 1, desc: 'Away' }] }, { id: '202', specifier: 'setnr=1', product: 1, desc: 'first set - winner', status: 3, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 0, outcomes: [{ id: '4', odds: '1.01', isActive: 0, desc: 'Home', isWinning: 1, refundFactor: 0.0 }, { id: '5', odds: '9.00', isActive: 1, desc: 'Away', isWinning: 0, refundFactor: 0.0 }] }, { id: '202', specifier: 'setnr=2', product: 1, desc: 'second set - winner', status: 0, group: 'Main', marketGuide: 'Who is winner of the Nth set', title: '1,2', name: 'Current Set Winner', favourite: 1, outcomes: [{ id: '4', odds: '1.75', isActive: 1, desc: 'Home' }, { id: '5', odds: '1.85', isActive: 1, desc: 'Away' }] }] }], categoryName: 'ITF Men', categoryId: 'sr:category:785' }]
	};

const popularData = {
	bizCode: 10000,
	message: '0#0',
	data: {
		'sr:sport:1':[{
			'sportId':'sr:sport:1',
			'text':'Euro List',
			'linkUrl':'www.1.com'
		},{
			'sportId':'sr:sport:1',
			'text':'Popular',
			'linkUrl':'www.2.com'
		}],
		'sr:sport:2':[{
			'sportId':'sr:sport:2',
			'text':'Euro List',
			'linkUrl':'www.3.com'
		},{
			'sportId':'sr:sport:2',
			'text':'Popular',
			'linkUrl':'www.4.com'
		}]
	}
};

const sportsSizeData = {
	bizCode: 10000,
	message: '0#0',
	data: [
		{ id: 'sr:sport:1', name: 'Football', eventSize: 4 },
		{ id: 'sr:sport:2', name: 'Basketball', eventSize: 3 },
		{ id: 'sr:sport:21', name: 'Cricket', eventSize: 1 }
	]
};
/*
	根据sportsId获取sports信息
 */
mockjax.get('/factsCenter/wapSportOption?sportId=sr:sport:1', data1,
	{
		query: {
			sportId: 'sr:sport:1'
		}
	}
);
mockjax.get('/factsCenter/wapSportOption?sportId=sr:sport:2', data2,
	{
		query: {
			sportId: 'sr:sport:2'
		}
	}
);
mockjax.get('/factsCenter/wapSportOption?sportId=sr:sport:5', data3,
	{
		query: {
			sportId: 'sr:sport:5'
		}
	}
);
mockjax.get('/factsCenter/wapSportOption?sportId=sr:sport:12', data4,
	{
		query: {
			sportId: 'sr:sport:12'
		}
	}
);
mockjax.get('/factsCenter/wapSportOption?sportId=sr:sport:21', data5,
	{
		query: {
			sportId: 'sr:sport:21'
		}
	}
);
mockjax.get('/factsCenter/sportList', sportsSizeData);
mockjax.get('/factsCenter/wapSportOption', data1);
mockjax.get('/promotion/v1/bonus/plans/valid', data1);
mockjax.get('/factsCenter/extendPopularSports', popularData);
