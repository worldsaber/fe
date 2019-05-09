# 说明

> 赛前比赛文件夹

## tournamentList

目前用于展示 euro list的需求；展示一系列联赛列表;
区别于eventList的原因是 列表默认需要展开3个，需要增加一个{count: 3}的参数，新接口wapEventsByOrder 不支持， 只用旧接口[wapEvents, wapChooseEvents]； 所以新开一个组件进行隔离，简化逻辑。

euroList: /sport/:sportName/tournamentlist/:tournamentId
e.g: "https://www.sportybet.com/ke/m/sport/football/tournamentlist/sr:tournament:135_sr:tournament:390_sr:tournament:166?time=today"
