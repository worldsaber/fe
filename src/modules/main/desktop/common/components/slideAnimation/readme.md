# 可滑动的弹窗组件（事件驱动，目前不支持手势）

## container

propsName | desc & type          | required
--------- | -------------------- | --------
pageCount | 滑动的弹窗数量 string       | true
slot      | 滑动页面列表 slot          | true
canBubble | 点击滑动区域是否隐藏弹窗 Boolean | false
show      | 是否显示弹窗               | false

## pageItem

propsName | desc & type       | required
--------- | ----------------- | --------
pageIndex | 页面索引 Number(从0开始) | true
slot      | page 子项 slot      | true

### 注意：

1. 外部需要监听的事件popDialogEvent.NEXT_PAGE、popDialogEvent.PREV_PAGE 2.

  ```
  <SlidePopDialog :pageCount='5' width="320px" height="300px">
  <template v-for="(item,index) in 5">
    <pageItem :pageIndex="index">
        <p>{{item}}</p>
        <div class="m-operation">
            <button type="button" name="prev" @click="goPrev(index)">prev</button>
            <button type="button" name="next" @click="goNext(index)">next</button>
        </div>
    </pageItem>
  </template>
  </slideAnimation>
  ```
