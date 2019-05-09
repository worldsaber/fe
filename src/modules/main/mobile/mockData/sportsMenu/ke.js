import mockjax from 'mock';

const data = {
	bizCode: 10000,
	message: '0#0',
	data: {
		sportList: [{
			id: 'sr:sport:1',
			name: 'Football',
			eventSize: 1069,
			categories: [{
				id: 'sr:category:48',
				name: 'Argentina',
				eventSize: 16,
				tournaments: [{
					id: 'sr:tournament:155',
					name: 'Primera Division',
					eventSize: 15
				},
				{
					id: 'sr:tournament:1347',
					name: 'Primera B',
					eventSize: 1
				}
				]
			}, {
				id: 'sr:category:296',
				name: 'Armenia',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:671',
					name: 'Premier League',
					eventSize: 3
				}, {
					id: 'sr:tournament:672',
					name: 'First League',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:34',
				name: 'Australia',
				eventSize: 32,
				tournaments: [{
					id: 'sr:tournament:136',
					name: 'A-League',
					eventSize: 5
				}, {
					id: 'sr:tournament:1258',
					name: 'NPL, South Australia',
					eventSize: 6
				}, {
					id: 'sr:tournament:1270',
					name: 'NPL, Western Australia',
					eventSize: 7
				}, {
					id: 'sr:tournament:1274',
					name: 'NPL, New South Wales',
					eventSize: 7
				}, {
					id: 'sr:tournament:1275',
					name: 'NPL, Victoria',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:17',
				name: 'Austria',
				eventSize: 12,
				tournaments: [{
					id: 'sr:tournament:45',
					name: 'Bundesliga',
					eventSize: 5
				}, {
					id: 'sr:tournament:135',
					name: 'Erste Liga',
					eventSize: 5
				}, {
					id: 'sr:tournament:445',
					name: 'OFB Cup',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:97',
				name: 'Austria Amateur',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:168',
					name: 'Regionalliga Centre',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:351',
				name: 'Bahrain',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:846',
					name: 'Premier League',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:33',
				name: 'Belgium',
				eventSize: 11,
				tournaments: [{
					id: 'sr:tournament:38',
					name: 'First Division A',
					eventSize: 9
				}, {
					id: 'sr:tournament:9',
					name: 'First Division B',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:379',
				name: 'Bolivia',
				eventSize: 7,
				tournaments: [{
					id: 'sr:tournament:866',
					name: 'Liga Profesional Bolivia',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:13',
				name: 'Brazil',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:92',
					name: 'Carioca',
					eventSize: 1
				}, {
					id: 'sr:tournament:377',
					name: 'Gaucho',
					eventSize: 1
				}, {
					id: 'sr:tournament:379',
					name: 'Mineiro',
					eventSize: 1
				}, {
					id: 'sr:tournament:373',
					name: 'Copa do Brasil',
					eventSize: 2
				}, {
					id: 'sr:tournament:14413',
					name: 'U20 Copa do Brasil',
					eventSize: 4
				}, {
					id: 'sr:tournament:372',
					name: 'Paulista, Serie A1',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:78',
				name: 'Bulgaria',
				eventSize: 9,
				tournaments: [{
					id: 'sr:tournament:247',
					name: 'First Professional League',
					eventSize: 7
				}, {
					id: 'sr:tournament:365',
					name: 'Bulgarian Cup',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:391',
				name: 'Cameroon',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:1006',
					name: 'Elite One',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:49',
				name: 'Chile',
				eventSize: 8,
				tournaments: [{
					id: 'sr:tournament:244',
					name: 'Primera Division',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:99',
				name: 'China',
				eventSize: 15,
				tournaments: [{
					id: 'sr:tournament:649',
					name: 'Chinese Super League',
					eventSize: 8
				}, {
					id: 'sr:tournament:782',
					name: 'China League',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:274',
				name: 'Colombia',
				eventSize: 19,
				tournaments: [{
					id: 'sr:tournament:241',
					name: 'Primera A',
					eventSize: 11
				}, {
					id: 'sr:tournament:1238',
					name: 'Primera B',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:289',
				name: 'Costa Rica',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:84',
					name: 'Primera Division',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:14',
				name: 'Croatia',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:170',
					name: '1. HNL',
					eventSize: 5
				}, {
					id: 'sr:tournament:307',
					name: 'Croatian Cup',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:18',
				name: 'Czech Republic',
				eventSize: 29,
				tournaments: [{
					id: 'sr:tournament:172',
					name: '1. Liga',
					eventSize: 16
				}, {
					id: 'sr:tournament:205',
					name: 'FNL',
					eventSize: 11
				}, {
					id: 'sr:tournament:282',
					name: 'Cup',
					eventSize: 1
				}, {
					id: 'sr:tournament:822',
					name: 'U19 1st Division',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:8',
				name: 'Denmark',
				eventSize: 18,
				tournaments: [{
					id: 'sr:tournament:47',
					name: '1st Division',
					eventSize: 7
				}, {
					id: 'sr:tournament:65',
					name: '2nd Division',
					eventSize: 7
				}, {
					id: 'sr:tournament:76',
					name: 'DBU Pokalen',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:305',
				name: 'Egypt',
				eventSize: 7,
				tournaments: [{
					id: 'sr:tournament:808',
					name: 'Premier League',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:367',
				name: 'El Salvador',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:1081',
					name: 'Primera Division',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:1',
				name: 'England',
				eventSize: 79,
				tournaments: [{
					id: 'sr:tournament:17',
					name: 'Premier League',
					eventSize: 30
				}, {
					id: 'sr:tournament:18',
					name: 'Championship',
					eventSize: 12
				}, {
					id: 'sr:tournament:24',
					name: 'League One',
					eventSize: 11
				}, {
					id: 'sr:tournament:25',
					name: 'League Two',
					eventSize: 11
				}, {
					id: 'sr:tournament:173',
					name: 'National League',
					eventSize: 12
				}, {
					id: 'sr:tournament:19',
					name: 'FA Cup',
					eventSize: 2
				}, {
					id: 'sr:tournament:334',
					name: 'Football League Trophy',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:252',
				name: 'England Amateur',
				eventSize: 27,
				tournaments: [{
					id: 'sr:tournament:176',
					name: 'National League North',
					eventSize: 11
				}, {
					id: 'sr:tournament:174',
					name: 'National League South',
					eventSize: 11
				}, {
					id: 'sr:tournament:1111',
					name: 'Northern League, Pr. Div',
					eventSize: 4
				}, {
					id: 'sr:tournament:1044',
					name: 'The FA Women\'s Super League',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:92',
				name: 'Estonia',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:178',
					name: 'Premium Liiga',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:19',
				name: 'Finland',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:41',
					name: 'Veikkausliiga',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:7',
				name: 'France',
				eventSize: 43,
				tournaments: [{
					id: 'sr:tournament:34',
					name: 'Ligue 1',
					eventSize: 31
				}, {
					id: 'sr:tournament:182',
					name: 'Ligue 2',
					eventSize: 10
				}, {
					id: 'sr:tournament:335',
					name: 'Coupe de France',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:270',
				name: 'Georgia',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:704',
					name: 'National League',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:30',
				name: 'Germany',
				eventSize: 49,
				tournaments: [{
					id: 'sr:tournament:35',
					name: 'Bundesliga',
					eventSize: 27
				}, {
					id: 'sr:tournament:44',
					name: '2nd Bundesliga',
					eventSize: 9
				}, {
					id: 'sr:tournament:491',
					name: '3rd Liga',
					eventSize: 11
				}, {
					id: 'sr:tournament:217',
					name: 'DFB Pokal',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:122',
				name: 'Germany Amateur',
				eventSize: 43,
				tournaments: [{
					id: 'sr:tournament:42',
					name: 'Regionalliga North',
					eventSize: 4
				}, {
					id: 'sr:tournament:1091',
					name: 'Bayernliga South',
					eventSize: 1
				}, {
					id: 'sr:tournament:142',
					name: 'Oberliga BW',
					eventSize: 1
				}, {
					id: 'sr:tournament:1103',
					name: 'Oberliga Niederrhein',
					eventSize: 1
				}, {
					id: 'sr:tournament:1109',
					name: 'Oberliga Rheinland-Pfalz',
					eventSize: 1
				}, {
					id: 'sr:tournament:1085',
					name: 'Regionalliga Bavaria',
					eventSize: 10
				}, {
					id: 'sr:tournament:1083',
					name: 'Regionalliga Northeast',
					eventSize: 7
				}, {
					id: 'sr:tournament:1079',
					name: 'Regionalliga Southwest',
					eventSize: 9
				}, {
					id: 'sr:tournament:493',
					name: 'Regionalliga West',
					eventSize: 9
				}]
			}, {
				id: 'sr:category:67',
				name: 'Greece',
				eventSize: 15,
				tournaments: [{
					id: 'sr:tournament:185',
					name: 'Super League',
					eventSize: 8
				}, {
					id: 'sr:tournament:186',
					name: 'Football League',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:365',
				name: 'Guatemala',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:177',
					name: 'Liga Nacional',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:11',
				name: 'Hungary',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:187',
					name: 'NB I',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:10',
				name: 'Iceland',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:2104',
					name: 'League Cup A',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:4',
				name: 'International',
				eventSize: 64,
				tournaments: [{
					id: 'sr:tournament:780',
					name: 'WC Qualification Women',
					eventSize: 14
				}, {
					id: 'sr:tournament:16',
					name: 'World Cup',
					eventSize: 48
				}, {
					id: 'sr:tournament:852',
					name: 'Int. Friendly Games W',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:393',
				name: 'International Clubs',
				eventSize: 23,
				tournaments: [{
					id: 'sr:tournament:7',
					name: 'UEFA Champions League',
					eventSize: 4
				}, {
					id: 'sr:tournament:679',
					name: 'UEFA Europa League',
					eventSize: 4
				}, {
					id: 'sr:tournament:463',
					name: 'AFC Champions League',
					eventSize: 4
				}, {
					id: 'sr:tournament:668',
					name: 'AFC Cup',
					eventSize: 1
				}, {
					id: 'sr:tournament:498',
					name: 'CONCACAF CL',
					eventSize: 2
				}, {
					id: 'sr:tournament:384',
					name: 'Copa Libertadores',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:392',
				name: 'International Youth',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:746',
					name: 'U19 Euro W Ch.ship, QF',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:301',
				name: 'Iran',
				eventSize: 8,
				tournaments: [{
					id: 'sr:tournament:915',
					name: 'Pro League',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:51',
				name: 'Ireland',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:192',
					name: 'Premier Division',
					eventSize: 5
				}, {
					id: 'sr:tournament:193',
					name: 'First Division',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:66',
				name: 'Israel',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:266',
					name: 'Premier League',
					eventSize: 2
				}, {
					id: 'sr:tournament:727',
					name: 'National League',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:31',
				name: 'Italy',
				eventSize: 36,
				tournaments: [{
					id: 'sr:tournament:23',
					name: 'Serie A',
					eventSize: 24
				}, {
					id: 'sr:tournament:53',
					name: 'Serie B',
					eventSize: 11
				}, {
					id: 'sr:tournament:328',
					name: 'Coppa Italia',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:502',
				name: 'Jamaica',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:1892',
					name: 'Premier League',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:52',
				name: 'Japan',
				eventSize: 24,
				tournaments: [{
					id: 'sr:tournament:196',
					name: 'J.League',
					eventSize: 9
				}, {
					id: 'sr:tournament:402',
					name: 'J.League 2',
					eventSize: 11
				}, {
					id: 'sr:tournament:101',
					name: 'J. League Cup',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:805',
				name: 'Kenya',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:1644',
					name: 'Premier League',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:331',
				name: 'Kuwait',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:1002',
					name: 'Kuwait League',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:160',
				name: 'Lithuania',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:198',
					name: 'A Lyga',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:159',
				name: 'Macedonia',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:199',
					name: '1. MFL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:12',
				name: 'Mexico',
				eventSize: 9,
				tournaments: [{
					id: 'sr:tournament:352',
					name: 'Primera Division',
					eventSize: 9
				}]
			}, {
				id: 'sr:category:386',
				name: 'Montenegro',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:154',
					name: '1. CFL',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:35',
				name: 'Netherlands',
				eventSize: 29,
				tournaments: [{
					id: 'sr:tournament:37',
					name: 'Eredivisie',
					eventSize: 18
				}, {
					id: 'sr:tournament:131',
					name: 'Eerste Divisie',
					eventSize: 10
				}, {
					id: 'sr:tournament:330',
					name: 'KNVB beker',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:389',
				name: 'Nicaragua',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:19242',
					name: 'Primera Division',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:532',
				name: 'Nigeria',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:2112',
					name: 'Premier League',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:130',
				name: 'Northern Ireland',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:701',
					name: 'IFA Championship',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:5',
				name: 'Norway',
				eventSize: 16,
				tournaments: [{
					id: 'sr:tournament:20',
					name: 'Eliteserien',
					eventSize: 8
				}, {
					id: 'sr:tournament:22',
					name: '1st Division',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:415',
				name: 'Oman',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:2032',
					name: 'Sultan Cup',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:280',
				name: 'Paraguay',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:693',
					name: 'Primera Division',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:20',
				name: 'Peru',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:406',
					name: 'Primera Division',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:847',
				name: 'Philippines',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:1654',
					name: 'Philippines Footb. League',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:47',
				name: 'Poland',
				eventSize: 26,
				tournaments: [{
					id: 'sr:tournament:202',
					name: 'Ekstraklasa',
					eventSize: 8
				}, {
					id: 'sr:tournament:229',
					name: 'I Liga',
					eventSize: 14
				}, {
					id: 'sr:tournament:281',
					name: 'Puchar Polski',
					eventSize: 1
				}, {
					id: 'sr:tournament:1365',
					name: 'CLJ',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:44',
				name: 'Portugal',
				eventSize: 20,
				tournaments: [{
					id: 'sr:tournament:238',
					name: 'Primeira Liga',
					eventSize: 9
				}, {
					id: 'sr:tournament:239',
					name: 'Segunda Liga',
					eventSize: 11
				}]
			}, {
				id: 'sr:category:291',
				name: 'Republic of Korea',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:410',
					name: 'K-League Classic',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:77',
				name: 'Romania',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:152',
					name: 'Liga I',
					eventSize: 7
				}, {
					id: 'sr:tournament:562',
					name: 'Liga 2',
					eventSize: 1
				}, {
					id: 'sr:tournament:355',
					name: 'Romania Cup',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:21',
				name: 'Russia',
				eventSize: 46,
				tournaments: [{
					id: 'sr:tournament:203',
					name: 'Premier League',
					eventSize: 27
				}, {
					id: 'sr:tournament:204',
					name: 'Football National League',
					eventSize: 10
				}, {
					id: 'sr:tournament:91',
					name: 'Russian Cup',
					eventSize: 1
				}, {
					id: 'sr:tournament:1093',
					name: 'PFL, South',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:310',
				name: 'Saudi Arabia',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:2298',
					name: 'Division 1',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:22',
				name: 'Scotland',
				eventSize: 24,
				tournaments: [{
					id: 'sr:tournament:36',
					name: 'Premiership',
					eventSize: 7
				}, {
					id: 'sr:tournament:207',
					name: 'League One',
					eventSize: 5
				}, {
					id: 'sr:tournament:209',
					name: 'League Two',
					eventSize: 5
				}, {
					id: 'sr:tournament:206',
					name: 'Championship',
					eventSize: 5
				}, {
					id: 'sr:tournament:347',
					name: 'Scottish Cup',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:152',
				name: 'Serbia',
				eventSize: 8,
				tournaments: [{
					id: 'sr:tournament:210',
					name: 'Superliga',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:45',
				name: 'Singapore',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:634',
					name: 'S.League',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:23',
				name: 'Slovakia',
				eventSize: 7,
				tournaments: [{
					id: 'sr:tournament:211',
					name: 'Superliga',
					eventSize: 6
				}, {
					id: 'sr:tournament:303',
					name: 'Slovensky Pohar',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:24',
				name: 'Slovenia',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:212',
					name: 'PrvaLiga',
					eventSize: 1
				}, {
					id: 'sr:tournament:532',
					name: '2nd Liga',
					eventSize: 1
				}, {
					id: 'sr:tournament:291',
					name: 'Slovenia Cup',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:322',
				name: 'South Africa',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:358',
					name: 'Premier Soccer League',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:32',
				name: 'Spain',
				eventSize: 43,
				tournaments: [{
					id: 'sr:tournament:8',
					name: 'LaLiga',
					eventSize: 30
				}, {
					id: 'sr:tournament:54',
					name: 'LaLiga 2',
					eventSize: 11
				}, {
					id: 'sr:tournament:544',
					name: 'Second Division B',
					eventSize: 1
				}, {
					id: 'sr:tournament:329',
					name: 'Copa del Rey',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:421',
				name: 'Spain Amateur',
				eventSize: 13,
				tournaments: [{
					id: 'sr:tournament:17504',
					name: 'Tercera Division',
					eventSize: 13
				}]
			}, {
				id: 'sr:category:9',
				name: 'Sweden',
				eventSize: 24,
				tournaments: [{
					id: 'sr:tournament:40',
					name: 'Allsvenskan',
					eventSize: 16
				}, {
					id: 'sr:tournament:46',
					name: 'Superettan',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:25',
				name: 'Switzerland',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:215',
					name: 'Super League',
					eventSize: 5
				}, {
					id: 'sr:tournament:216',
					name: 'Challenge League',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:378',
				name: 'Tunisia',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:1682',
					name: 'Tunisian Cup',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:46',
				name: 'Turkey',
				eventSize: 9,
				tournaments: [{
					id: 'sr:tournament:52',
					name: 'Super Lig',
					eventSize: 9
				}]
			}, {
				id: 'sr:category:824',
				name: 'Uganda',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:14864',
					name: 'Premier League',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:86',
				name: 'Ukraine',
				eventSize: 7,
				tournaments: [{
					id: 'sr:tournament:218',
					name: 'Premier League',
					eventSize: 6
				}, {
					id: 'sr:tournament:312',
					name: 'Ukraine Cup',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:299',
				name: 'United Arab Emirates',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:971',
					name: 'Arabian Gulf League',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:26',
				name: 'USA',
				eventSize: 8,
				tournaments: [{
					id: 'sr:tournament:242',
					name: 'Major League Soccer',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:281',
				name: 'Venezuela',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:231',
					name: 'Primera Division',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:366',
				name: 'Vietnam',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:626',
					name: 'V-League',
					eventSize: 3
				}]
			}]
		},
		// {
		// 	id: 'sr:sport:21',
		// 	name: 'Cricket',
		// 	eventSize: 5,
		// 	categories: [{
		// 		id: 'sr:category:497',
		// 		name: 'India',
		// 		eventSize: 5,
		// 		tournaments: [{
		// 			id: 'sr:tournament:2472',
		// 			name: 'Indian Premier League',
		// 			eventSize: 5
		// 		}]
		// 	}]
		// },
		{
			id: 'sr:sport:2',
			name: 'Basketball',
			eventSize: 103,
			categories: [{
				id: 'sr:category:264',
				name: 'Argentina',
				eventSize: 3,
				tournaments: [{
					id: 'sr:tournament:1680',
					name: 'LNB',
					eventSize: 3
				}]
			}, {
				id: 'sr:category:170',
				name: 'Austria',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:297',
					name: 'ABL',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:263',
				name: 'Brazil',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:1562',
					name: 'NBB',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:548',
				name: 'China',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:1566',
					name: 'CBA',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:154',
				name: 'Czech Republic',
				eventSize: 7,
				tournaments: [{
					id: 'sr:tournament:250',
					name: 'NBL',
					eventSize: 6
				}, {
					id: 'sr:tournament:1484',
					name: 'ZBL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:244',
				name: 'Denmark',
				eventSize: 2,
				tournaments: [{
					id: 'sr:tournament:843',
					name: 'Basketligaen',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:117',
				name: 'England',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:230',
					name: 'BBL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:194',
				name: 'Estonia',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:973',
					name: 'KML',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:149',
				name: 'Finland',
				eventSize: 5,
				tournaments: [{
					id: 'sr:tournament:226',
					name: 'Korisliigan',
					eventSize: 5
				}]
			}, {
				id: 'sr:category:110',
				name: 'France',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:156',
					name: 'Pro A',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:111',
				name: 'Germany',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:227',
					name: 'BBL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:108',
				name: 'Greece',
				eventSize: 10,
				tournaments: [{
					id: 'sr:tournament:304',
					name: 'A1',
					eventSize: 2
				}, {
					id: 'sr:tournament:20154',
					name: 'A2',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:103',
				name: 'International',
				eventSize: 18,
				tournaments: [{
					id: 'sr:tournament:14051',
					name: 'Champions League',
					eventSize: 3
				}, {
					id: 'sr:tournament:141',
					name: 'Eurocup',
					eventSize: 1
				}, {
					id: 'sr:tournament:138',
					name: 'Euroleague',
					eventSize: 8
				}, {
					id: 'sr:tournament:1167',
					name: 'Euroleague Women',
					eventSize: 2
				}, {
					id: 'sr:tournament:1438',
					name: 'United League',
					eventSize: 2
				}, {
					id: 'sr:tournament:582',
					name: 'Baltic Basketball League',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:107',
				name: 'Italy',
				eventSize: 9,
				tournaments: [{
					id: 'sr:tournament:262',
					name: 'Serie A',
					eventSize: 9
				}]
			}, {
				id: 'sr:category:258',
				name: 'Latvia',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:982',
					name: 'LBL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:539',
				name: 'Philippines',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:1956',
					name: 'PBA, Philippine Cup',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:284',
				name: 'Poland',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:263',
					name: 'PLK',
					eventSize: 2
				}, {
					id: 'sr:tournament:1916',
					name: 'PLKK',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:287',
				name: 'Portugal',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:1926',
					name: 'LPB',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:375',
				name: 'Republic of Korea',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:1540',
					name: 'KBL',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:157',
				name: 'Russia',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:1201',
					name: 'Premier League Women',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:383',
				name: 'Slovakia',
				eventSize: 1,
				tournaments: [{
					id: 'sr:tournament:1412',
					name: 'Extraliga, Women',
					eventSize: 1
				}]
			}, {
				id: 'sr:category:109',
				name: 'Spain',
				eventSize: 11,
				tournaments: [{
					id: 'sr:tournament:264',
					name: 'Spagnola ACB',
					eventSize: 9
				}, {
					id: 'sr:tournament:1538',
					name: 'Liga Femenina',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:112',
				name: 'Turkey',
				eventSize: 6,
				tournaments: [{
					id: 'sr:tournament:1532',
					name: 'TKBL',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:15',
				name: 'USA',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:132',
					name: 'NBA',
					eventSize: 4
				}]
			}]
		}, {
			id: 'sr:sport:12',
			name: 'Rugby',
			eventSize: 51,
			categories: [{
				id: 'sr:category:83',
				name: 'Rugby League',
				eventSize: 22,
				tournaments: [{
					id: 'sr:tournament:294',
					name: 'NRL',
					eventSize: 16
				}, {
					id: 'sr:tournament:302',
					name: 'Super League',
					eventSize: 6
				}]
			}, {
				id: 'sr:category:82',
				name: 'Rugby Union',
				eventSize: 29,
				tournaments: [{
					id: 'sr:tournament:422',
					name: 'Super Rugby',
					eventSize: 6
				}, {
					id: 'sr:tournament:424',
					name: 'English Premiership',
					eventSize: 6
				}, {
					id: 'sr:tournament:401',
					name: 'European Cup',
					eventSize: 2
				}, {
					id: 'sr:tournament:419',
					name: 'Pro 14',
					eventSize: 7
				}, {
					id: 'sr:tournament:420',
					name: 'Top 14',
					eventSize: 7
				}, {
					id: 'sr:tournament:1147',
					name: 'Pro D2',
					eventSize: 1
				}]
			}]
		},
		{
			id: 'sr:sport:5',
			name: 'Tennis',
			eventSize: 34,
			categories: [{
				id: 'sr:category:76',
				name: 'Davis Cup',
				eventSize: 4,
				tournaments: [{
					id: 'sr:tournament:2100',
					name: 'Davis Cup',
					eventSize: 4
				}]
			}, {
				id: 'sr:category:6',
				name: 'WTA',
				eventSize: 30,
				tournaments: [{
					id: 'sr:tournament:2765',
					name: 'WTA Charleston, USA Women Double',
					eventSize: 4
				}, {
					id: 'sr:tournament:2763',
					name: 'WTA Charleston, USA Women Singles',
					eventSize: 14
				}, {
					id: 'sr:tournament:2717',
					name: 'WTA Monterrey, Mexico Women Double',
					eventSize: 4
				}, {
					id: 'sr:tournament:2715',
					name: 'WTA Monterrey, Mexico Women Singles',
					eventSize: 8
				}]
			}]
		}
		],
		popularEvents: [{
			id: 'sr:sport:1',
			name: 'Football',
			eventSize: 94,
			categories: [{
				id: 'sr:category:top',
				name: 'Top Leagues',
				eventSize: 46,
				tournaments: [{
					id: 'sr:tournament:17',
					name: 'Premier League',
					eventSize: 30
				}, {
					id: 'sr:tournament:38',
					name: 'First Division A',
					eventSize: 9
				}, {
					id: 'sr:tournament:36',
					name: 'Premiership',
					eventSize: 7
				}]
			}, {
				id: 'sr:category:22',
				name: 'Scotland',
				eventSize: 24,
				tournaments: [{
					id: 'sr:tournament:36',
					name: 'Premiership',
					eventSize: 7
				}, {
					id: 'sr:tournament:207',
					name: 'League One',
					eventSize: 5
				}, {
					id: 'sr:tournament:209',
					name: 'League Two',
					eventSize: 5
				}, {
					id: 'sr:tournament:206',
					name: 'Championship',
					eventSize: 5
				}, {
					id: 'sr:tournament:347',
					name: 'Scottish Cup',
					eventSize: 2
				}]
			}, {
				id: 'sr:category:301',
				name: 'Iran',
				eventSize: 8,
				tournaments: [{
					id: 'sr:tournament:915',
					name: 'Pro League',
					eventSize: 8
				}]
			}, {
				id: 'sr:category:48',
				name: 'Argentina',
				eventSize: 16,
				tournaments: [{
					id: 'sr:tournament:155',
					name: 'Primera Division',
					eventSize: 15
				}, {
					id: 'sr:tournament:1347',
					name: 'Primera B',
					eventSize: 1
				}]
			}]
		}]
	}
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
mockjax.get('/factsCenter/sportList', sportsSizeData);
mockjax.get('/factsCenter/popularAndSportList', data);
mockjax.get('/factsCenter/extendPopularSports', popularData);
