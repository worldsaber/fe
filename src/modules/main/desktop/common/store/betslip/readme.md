# betslips存储数据格式

name     | type   | default | desc
-------- | ------ | ------- | ---------------------------------------
betslips | Object | {}      | 存储在localstorage中，所有操作均需及时更新localstorage

# mutaions

type   | functionName            | arguments
------ | ----------------------- | ------------------------------------------------------------
delete | DELETE_BETSLIPS_ITEM    | key (sportId_eventId_marketId(?specifier不空时拼上)_outcomeId必传)
add    | ADD_BETSLIPS_ITEM       | { key（同上）、betInfo}
update | UPDATE_BETSLIPS_ITEM    | { key（同上）、betInfo}， 注意过期的投注项
accept | ACCEPT_BETSLIPS_CHANGES | 无

# mutation中涉到的key必须按上面的格式传递，保证多个页面的同一个outcome能够跨模块更新选中状态

# mutation中涉到的betInfo需要包含一下字段

name         | desc
------------ | ----------------------------------------------------------------------------------------------------
home         | 主队名
away         | 客队名
outcomeInfo  | 投注项的信息（包含id、desc、odds、isActive、pushtime没有传空）
marketInfo   | market相关信息（desc、id、specifier（如果已经处理在marketId中，则不需要传，否则必须传）、product、group没有可以不传、status、pushtime没有传空）
gameId       |
eventId      | event的Id
sportId      | sport的Id
sportName    | sportName
categoryId   | category的Id
tournamentId | tournament的Id

# 为保证数据的准确性，先读本地数据，再请求快照数据，最后加载query中sharecode中
