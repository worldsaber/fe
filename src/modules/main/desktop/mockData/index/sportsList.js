import mockjax from 'mock';

mockjax.get(/\/test\/mock/, {
	resStatus: 0,
	data: [
		{
			type: 'DNB',
			list: [
				{
					key: 'FK',
					rate: '1/20'
				}, {
					key: 'FC',
					rate: '15/2'
				}
			]
		}, {
			type: 'Doubel Chance',
			list: [
				{
					key: 'FC or Draw',
					rate: '1/80'
				}, {
					key: 'FK or Draw',
					rate: '1/9'
				}, {
					key: 'FC or FK',
					rate: '3/1'
				}
			]
		}
	]
});
