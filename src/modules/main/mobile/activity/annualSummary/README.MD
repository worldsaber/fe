# 年终总结活动

## 页面切换采用路由的方式

## 图片预加载

1. 预加载范围为下1页
2. 每页都有一个对应的待加载图片列表
3. 首先加载首屏的图片，当全部加载完毕后，解除loading状态
4. 首页加载后1页的图片
5. 后面的第T页，预加载后面T+1页的图片 [逻辑可以统一写在路由里面，也可以分散写死在页面组件里面]
