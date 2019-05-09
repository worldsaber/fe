import mockjax from 'mock';

mockjax.get('factsCenter/fastBetEvent', {
	bizCode: 123456,
	message: '测试内容12345',
	data: {
		eventId: '测试内容12345',
		gameId: 123456,
		estimateStartTime: 1516651200000,
		estimateStopTime: 123456,
		setScore: '测试内容12345',
		playedSeconds: '测试内容12345',
		period: '测试内容12345',
		homeTeamName: 'Southampton FC',
		awayTeamName: 'Crystal Palace',
		status: 123456,
		sport: {
			id: '测试内容12345',
			name: '测试内容12345',
			category: {
				id: '测试内容12345',
				name: 'England',
				tournament: {
					name: 'Premier Leagu',
					id: '测试内容12345'
				}
			}
		},
		markets: [{
			id: '测试内容12345',
			product: 123456,
			desc: '测试内容12345',
			group: '测试内容12345',
			status: 123456,
			outcomes: [{
				id: '测试内容12345',
				odds: '1.99',
				isActive: 1,
				desc: '测试内容12345'
			}],
			marketGuide: '测试内容12345',
			specifier: '测试内容12345',
			favourite: 123456,
			title: '测试内容12345',
			name: '测试内容12345'
		}, {
			id: '测试内容12345',
			product: 123456,
			desc: '测试内容12345',
			group: '测试内容12345',
			status: 123456,
			outcomes: [{
				id: '测试内容12345',
				odds: '2.99',
				isActive: 1,
				desc: '测试内容12345'
			}],
			marketGuide: '测试内容12345',
			specifier: '测试内容12345',
			favourite: 123456,
			title: '测试内容12345',
			name: '测试内容12345'
		}, {
			id: '测试内容12345',
			product: 123456,
			desc: '测试内容12345',
			group: '测试内容12345',
			status: 123456,
			outcomes: [{
				id: '测试内容12345',
				odds: '0.99',
				isActive: 1,
				desc: '测试内容12345'
			}],
			marketGuide: '测试内容12345',
			specifier: '测试内容12345',
			favourite: 123456,
			title: '测试内容12345',
			name: '测试内容12345'
		}],
		matchStatus: '测试内容12345',
		gameScore: [
			'string1',
			'string2',
			'string3',
			'string4',
			'string5'
		],
		pointScore: '测试内容12345',
		productStatus: '测试内容12345',
		liveChannel: true
	}
});
