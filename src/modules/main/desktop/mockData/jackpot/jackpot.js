import mockjax from 'mock';

mockjax.get(/\/jackpot\/banner/, {
    bizCode: 10000,
    msg: "",
    data: {
        "status": 1,
        "bgImage": "",
        "maxWinnings": 1000000000000,
        "leftTime": 1000000
    },
});

mockjax.get(/\/jackpot\/period$/, {
    "bizCode": 10000,
    "msg": "",
    "data": {
        "periodNumber": "20170908",
        "status": 1,
        "deadline": 1506406813,
        "elements": [
            {
                "index": 1,
                "date": 0,
                "home": "Newcastle",
                "away": "Stoke Ham",
                "eventId": "sr:match:11868008",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Newcastle",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Newcastle",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 2,
                "date": 1506393629,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868011",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 3,
                "date": 1506393629,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868013",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 4,
                "date": 1506393629,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868014",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 5,
                "date": 1506393629,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868015",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 6,
                "date": 1506393629,
                "home": "Birmingham City6",
                "away": "Bristol City",
                "eventId": "sr:match:11868016",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 7,
                "date": 1506393629,
                "home": "Birmingham City7",
                "away": "Bristol City",
                "eventId": "sr:match:11868017",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 8,
                "date": 1506393629,
                "home": "Birmingham City8",
                "away": "Bristol City",
                "eventId": "sr:match:11868018",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 9,
                "date": 1506393629,
                "home": "Birmingham City9",
                "away": "Bristol City",
                "eventId": "sr:match:11868019",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 10,
                "date": 1506393610,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868010",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            },
            {
                "index": 11,
                "date": 1506393629,
                "home": "Birmingham City",
                "away": "Bristol City",
                "eventId": "sr:match:11868021",
                "outcomes": [
                    {
                        "id": "1",
                        "desc": "Birmingham City",
                        "odds": "1.32"
                    },
                    {
                        "id": "2",
                        "desc": "draw",
                        "odds": "1.32"
                    },
                    {
                        "id": "3",
                        "desc": "Bristol City",
                        "odds": "1.32"
                    }
                ]
            }
        ]
    }
});

mockjax.get(/\/jackpot\/periodNumbers/, {
    "bizCode": 10000,
    "msg": "",
    "data": [
        "20170926",
        "20170826",
        "20170726"
    ]
});

mockjax.get(/\/jackpot\/previous.*/, {
    "bizCode": 10000,
    "msg": "",
    "data": {
        "periodNumber": "20170926",
        "status": 0,
        "winnings": [{
            "correctEvents": 11,
            "winNum": 5,
            "perWinnings": "137000"
        }, {
            "correctEvents": 10,
            "winNum": 2,
            "perWinnings": "32000"
        }
        ],
        "elements":[
            {
                "index":1,
                "date":1506393629,
                "home":"Birmingham",
                "away":"Bristol",
                "homeScore":"2",
                "awayScor":"1",
                "result":2
            },
            {
                "index":2,
                "date":1506393629,
                "home":"Birmingham",
                "away":"Bristol",
                "homeScore":"2",
                "awayScor":"1",
                "result":3
            },
            {
                "index":3,
                "date":1506393629,
                "home":"Birmingham",
                "away":"Bristol",
                "homeScore":"2",
                "awayScor":"1",
                "result":4
            }
        ]

    }
});

mockjax.get(/\/orders\/order/, {
    bizCode: 10000,
    innerMsg: "system reject",
    message: "",
    data: {
        "orderId": "sa12313"
    }
});