# 选择红包

## 说明

1. 这里取到的是一个分组红包，分4类(A:10, B:20, C:30, D:40, E:50);
    * A 类正常可用，但由于初始请求不含 stake 参数, 所以获取到的数据中 A、B 类是混合在一起的，后面需要进行分离；
    * B 类: Min. Stake Required Not Met
    * C 类: APP / PC 专享;
    * D 类: Not in the Valid Date
    * E 类: Other unusable reasons

2. 实际展示用的红包列表需要按用户输入的 statke 值进行筛选；
