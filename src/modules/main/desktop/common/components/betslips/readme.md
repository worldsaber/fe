### 特别注意
1. 改组件依赖于store， 必须保证组件所在的页面入口js文件中引入了store下的betslips
2. NOTIFY_BETSLIPS_CHANGE必须放在router module入口，防止事件监听不到

### 在其他模块需要监听的事件（事件常量定义在config/eventConfig/commonEvent.js中）
1. 投注项删除时： DELETE_BET_SLIPS_ITEM (回传组件传递到betslip的key，组件自己解key找到对应的匹配项)
2. betslips列表清空时：RESET_BET_SLIPS
3. betslip批量更新的情况：NOTIFY_BETSLIPS_CHANGE
	1). 页面初始化时同步本地存储的betslips的key列表
	2). accept changes触发的批量删除betslip

### 在其他模块中需要emit的事件（事件常量定义在config/eventConfig/listEvent.js中）
1. 选中某个outcome时： LIST_ITEM_ADD （需要向betslip组件传递key和betInfo）
2. 某个outcome有选中变成不选中时： LIST_ITEM_DELETE （需要向betslip组件传递key和betInfo）
