# finger说明
## 功能
主要是给vue增加选中的功能

``` html
<div id="cnt">
    <div
        v-finger:tap="tap"
        v-finger:multipoint-start="multipointStart"
        v-finger:long-tap="longTap"
        v-finger:swipe="swipe"
        v-finger:pinch="pinch"
        v-finger:rotate="rotate"
        v-finger:press-move="pressMove"
        v-finger:multipoint-end="multipointEnd"
        v-finger:double-tap="doubleTap"
        v-finger:single-tap="singleTap"
        v-finger:touch-start="touchStart"
        v-finger:touch-move="touchMove"
        v-finger:touch-end="touchEnd"
        v-finger:touch-cancel="touchCancel"
    >
        <div>the element that you want to bind event</div>
    </div>
</div>

```
