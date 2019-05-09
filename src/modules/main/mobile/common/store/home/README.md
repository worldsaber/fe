# 首页特有的模块

## 关于比赛列表的数据转换
1. 关于events，我们知道events会推送status，status变化只能删除比赛，不可能添加比赛,即使有添加比赛频率也很低，同样删除比赛得频率估计也不高，所以我们采用map输出events，
2. 关于market，因为market可以自定义顺序，并且market是按照id大小排列的，这里market的数据我们采用map表示（需注意，这里有specifiers的market的id相同，要处理成数组），在输出到页面时候，采用sort进行排序后输出，得保证用户置顶比赛在最上面
3. 关于outcome，因为outcome不可能增加，或者减少，只能是改变投注状态，所以这里我们outcome采用map表示，并且外加一个数组表示outcom得排序，如果outcome状态发生变化，我们只需要更新map即可

数据格式

``` javascript

const data = {
	events: {
		... otherInfo,
		eventId: {
			...otherInfo,
			// markets因为需要有置顶功能，所以统一自己排序
			markets: {
				marketId: {
					...otherInfo,
					outcomes: {

					},
					// 这里应该是没有增加或者杀出的
					outcomesOrder: [

					]
				}
			}
		}
	},
	// 表示排序的顺序
	// 注意如果这里有增加或者删除，需要修改索引
	eventsOrder: [eventsId, eventId, ...]
}


```
