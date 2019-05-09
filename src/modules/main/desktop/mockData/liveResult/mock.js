import mockjax from 'mock';

mockjax.get('/factsCenter/sportResultOption', {
	"data": [{
		"id": "1",
		"name": "aaaa",
		"categories": [{
			"id": "1_1",
			"name": "111",
			"tournaments": [{
				"id": "1-1-1",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			},
			{
				"id": "1-1-2",
				"name": "2222"
			}
			]
		},
		{
			"id": "1_2",
			"name": "111",
			"tournaments": [{
				"id": "1-2-1",
				"name": "2222"
			},
			{
				"id": "1-2-2",
				"name": "2222"
			}]
		}
	]},
	{
		"id": "2",
		"name": "2",
		"categories": [{
				"id": "2_1",
				"name": "2_1",
				"tournaments": [{
						"id": "2-1-1",
						"name": "2-1-1",
					},
					{
						"id": "2-1-2",
						"name": "2-1-2",
					}
				]
			},
			{
				"id": "2_2",
				"name": "2_2",
				"tournaments": [{
						"id": "2-2-1",
						"name": "2-2-1"
					},
					{
						"id": "2-2-2",
						"name": "2-2-22"
					}
				]
			}
		]
	}
	],
	"bizCode": 10000,
	"message": "测试内容12345"
});

mockjax.get('/factsCenter/eventResultList', {
	"bizCode": 10000,
	"data": {
		"tournaments": [{
			"id": "测试内容12345",
			"name": "tournaments",
			"events": [{
				"eventId": "测试内容12345",
				"gameId": "1234",
				"estimateStartTime": 123456789789,
				"homeTeamName": "homeTeamName",
				"awayTeamName": "awayTeamName",
				"sport": {
					"id": "",
					"name": "Football",
					"category": {
						"id": "测试内容12345",
						"name": "测试内容12345"
					}
				},
				"setScore": "100:100",
				"regularTimeScore": [
					"100:100",
					"1:0",
					// "2:3",
					// "2:2",
					// "2:2",
				],
				"overTimeScore": "1:1",
			}],
			"categoryName": "categoryName",
			"categoryId": "2"
		}],
		"totalNum": 200
	},
	"message": "测试内容12345",
	"moreEvents": true
});
