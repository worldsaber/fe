# 获取所有比赛的分类, 包括 sport分类，categoriy分类,tournaments分类,以及每个分类下的event数量

## 请求参数说明
* @sportId 赛事大分类，如果不给就返回所有的分类
* @timeline 长整形时间参数，会返回规定时间的比赛分类，可以不给
* @productId 1表示live，3表示prematch
* @option 1 如果只想取大分类的数量，则可以传递1， 如果不想获取tournament的数量，而是只想获取categories和sports则传递2

