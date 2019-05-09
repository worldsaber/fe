# (index.js)(适配器说明)
> 适配器的主要作用是将 详情页面传递过来的market做适配
> 详情页面传递过来的market可以有多种类型，如果是普通的market则是一个对象，则直接调用market去设置页面
> 如果传递过来是一个数组则是一组带speciefier的market，这个时候回根据现实情况去决定是否拆分成带speciefier的market在传递给market组件

# market说明
1. market.vue是走 单个market，包括带speciefier用&链接的
2. comboSpecifierMarket.vue是走多个market组合成一个market显示的逻辑

# content显示说明
- normalContent (正常显示的market即将market按照行一行一样显示，有一行2个，一行三个，2行4个的显示方案)
- comboContent (组合market，即speciefier是&符号连接的组合market)
- speciefierComoboContent(即将相同的speciefier的多个makert组合成一个market的显示模式)


# speciefierComoboContent显示说明
> speciefierComoboContent是将market数组拆分成一个横竖的表格显示, 根据不同的marketId可能显示的title不同，这里我们通过mixins进去显示
