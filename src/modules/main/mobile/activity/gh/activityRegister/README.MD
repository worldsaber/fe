# 注册活动说明

1. js/tj.js是一个市场需要的统计代码的js，index.vue直接引入，根据不同的from参数加载不同的统计代码

2. 统计代码在 regSuccess事件触发的时候需要，发送统计数据，则调用 ./js/succ方法

**每个参数对应的统计代码必须加上**

**landingPage中包装activityReg模块需要注意将regSuccess事件暴露出来并添加统计代码**
