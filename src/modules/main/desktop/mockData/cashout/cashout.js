import mockjax from 'mock';
/*
cashout 列表
params: pageSize、firstId
 */
mockjax.get('/realSportsGame/cashAbleBets', {
	bizCode: 10000,
	message: '',
	data: {
		totalNum: 30,
		cashAbleBets: [
			{
				id: '1709221402111000000123',
				status: 0,
				orderType: 'System',
				betType: 'Doubles',
				isSubscribe: 0,
				combinationNum: 3,
				originStake: '300.00',
				stake: '300.00',
				winning: '0.00',
				bonus: '0.00',
				potentialWinnings: '0.00',
				createTime: 1506031331424,
				selectionDescs: [
					{
						id: '1709221402111000000120',
						home: 'Bourchier, Harry',
						away: 'Mousley, Bradley'
					}, {
						id: '1709221402111000000121',
						home: 'Gibraltar',
						away: 'Estonia'
					}, {
						id: '1709221402111000000122',
						home: 'Croatia',
						away: 'Finland'
					}
				]
			}, {
				id: '1709221402111000000123',
				status: 0,
				orderType: 'System',
				betType: 'Doubles',
				isSubscribe: 0,
				combinationNum: 3,
				originStake: '300.00',
				stake: '300.00',
				winning: '0.00',
				bonus: '0.00',
				potentialWinnings: '0.00',
				createTime: 1506031331424,
				selectionDescs: [
					{
						id: '1709221402111000000120',
						home: 'Bourchier, Harry',
						away: 'Mousley, Bradley'
					}, {
						id: '1709221402111000000121',
						home: 'Gibraltar',
						away: 'Estonia'
					}, {
						id: '1709221402111000000122',
						home: 'Croatia',
						away: 'Finland'
					}
				]
			}
		]
	}
});

/*
cashout 详情页
params： betId
*/
mockjax.get('/realSportsGame/cashAbleBet', {
	bizCode: 10000,
	message: '',
	data: {
		id: '1709181906551000001963',
		orderId: '1709181906551000001988',
		status: 1,
		originStake: '384.00',
		stake: '300.00',
		orderType: 'System',
		betType: 'Single',
		combinationNum: 1,
		isSubscribe: 0,
		winnings: '400.00',
		potentialWinnings: '400.00',
		bonus: '50.00',
		createTime: 1506031331424,
		selections: [
			{
				id: '1709181906551000001963',
				odds: '5.45',
				outcomeDesc: 'Cska Moscow',
				status: 1,
				marketDesc: '1x2',
				eventDesc: 'Cska Moscow vs Aek Athens',
				eventPeriod: `46'`,
				score: '1-1',
				startTime: 1506031331424
			}, {
				id: '1709181906551000001964',
				odds: '9.65',
				outcomeDesc: 'Cska Moscow',
				status: 0,
				marketDesc: '1x2',
				eventDesc: 'Cska Moscow vs Aek Athens',
				startTime: 1506031331424
			}
		],
		cashOut: {
			coefficient: 1.03672728,
			isSupportPartial: true,
			maxCashOutAmount: '4.87',
			availableStake: '4.7'
		}
	}
});

/*
cashout请求
params: {
  betId: '201707111400049000001_multiple_1',
  usedStake: '200.00',
  isPartial: true,
  amount: '315.62'
}
 */
mockjax.post('/realSportsGame/cashOut', {
	bizCode: 1000,
	message: 'used stake must less than MaxUsedStake',
	data: {
		betId: '1505876822000postman_Single_1',
		coefficient: 1.03672728,
		isSupportPartial: true,
		maxCashOutAmount: '4.87',
		availableStake: '4.7'
	}
});
