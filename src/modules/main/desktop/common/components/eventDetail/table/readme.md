# outcomeCell

# props

name       | desc & type              | required & default
---------- | ------------------------ | ------------------
cellKey    | 单元格的key（唯一标记一列） & string | false & ''
disabled   | 是否可点 & boolean           | false & false
responsive | 是否有hover样式 & boolean     | false & true
operable   | 是否有点击事件 & boolean        | false & false
checked    | 单元格是否选中 & boolean        | false & false

## outcomesRow（可以自定义一行内容，也可以通过数据控制一行的内容，数据控制时需要设置colData、operationKeys、disabledKey、responsiveKeys）

name           | desc & type                | required & default
-------------- | -------------------------- | ------------------
colData        | 一行的完成数据 & array            | false
operationKeys  | 有点击事件的列 & Array            | false & []
responsiveKeys | 有hover效果的列 & Array         | false & []
slot           | 自定义一行的内容                   |
keySet         | 渲染单元格需要的object key & array | false
