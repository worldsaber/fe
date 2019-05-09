# 消息推送模块

# 说明

Push 基于 socket.io,根据公共组对接 socket.io 的推送文档进行接口封装。
Push在实例化后将自动建立websocket链接，因此在一个页面内，只需保留一个实例。

你不用关心 websocket 连接问题，也不用关心 socket.io 的 connect 和 reconnect 的问题，
只需要和业务后台确定好 topic 以及 topic 对应的数据，剩下的就是调用 Push sub 这个 topic
即可。

一个 topic 和 pushType 组成一个push channel，同一个 push channel 的多个 sub 动作
Push 并不会发送多次 sub 动作给 socket 服务端，Push 在本地会维护一个 channel 和 listener
的对应池，只有新的 channel 有注册，或者一个 channel 再也没有人关注了，才会向服务端 sub/unsub。

调用 Push 实例的 sub／unsub 时，不用关心当前的 websocket 是否已经建立，Push 会在建立好
连接的第一时间向服务器注册在初始化阶段就 sub 进来的 topic。相同的，在断线后，socket.io 会自动
尝试重新连接，重新连接后，Push 会恢复好断线之前向服务器 sub 过的 topic。

# 接口说明

## new Push(config)

+ config
	+ type: object
	+ required: false
	+ desc: 配置对象

+ config.devType
	+ type: string
	+ default: WEB
	+ desc: 设备类型

+ config.productCode
	+ type: number
	+ default: 1
	+ desc: 产品号

+ config.deviceId
	+ type: string
	+ default: random
	+ desc: 设备号，用于单推, 默认使用随机字符串

+ config.accountId
	+ type: string
	+ default: ''
	+ desc: 账户号，用于 multi 推送

+ config.server
	+ type: string
	+ default: //lconn.mpush.163.com
	+ desc: 服务器地址

+ config.socketOptions
	+ type: object
	+ default: {}
	+ desc: 建立socketIO时的options参数

## Push.PUSH_TYPE
+ type: enum
+ enum: MULTI GROUP SPECIAL
+ desc:
	+ multi 推送：向相同 accountId 的设备进行推送，当有多个在线时全部收到，当不在线时进行消息缓存，当任意一个上线拿走消息。

	+ special 推送：向指定 deviceId 的设备推送，全局唯一，支持缓存。

  + group 推送：向 topic 内所有进行推送，不支持缓存。

注意：主题+推送类型 确定唯一的推送通道，不同推送类型，相同主题推送完全独立。



## Push#sub({topic, pushType, listener, callback})

+ topic
	+ type: string
	+ required: true
	+ desc: 订阅的话题

	topic 可以包含通配符~，用来进行分级的订阅； 比如 prodcut^~^status 、 prodcut^100^~


+ pushType
	+ type: string
	+ enum: Push.PUSH_TYPE
	+ required: true
	+ desc: 订阅消息的类型

+ listener
	+ type: function
	+ required: true
	+ desc: 注册的订阅器
	+ sign: function listener(data)
		+ data
			+ type: string
			+ desc: 话题推送的数据，参阅推送后台相关的API文档

+ callback
	+ type: function
	+ required: false
	+ desc: 订阅动作成功后，一般情况下不用关注订阅动作的回调
	+ sign： function callback({retCode})


## Push#unsub({topic, pushType, listener, callback})

+ topic
	+ type: string
	+ required: true
	+ desc: 取消订阅的话题

+ pushType
	+ type: string
	+ required: true
	+ desc: 取消订阅的消息类型

+ listener
	+ type: function
	+ required: false
	+ desc: 订阅时注册的订阅器，为空则取消该topic+pushType组成的对应channel下的所有订阅器

+ callback
	+ type: function
	+ required: false
	+ desc: 订阅动作成功后，一般情况下不用关注取消订阅动作的回调
	+ sign： function callback({retCode})


## demo

```js
var Push = new Push();
Push.sub({
	topic: 'HQ_pmec_GDPT_R_A',
	pushType: Push.PUSH_TYPE.GROUP,
	listener: function(data){
		console.log(data);
	}
});
```

## push工程方法说明
* betPush: 比赛相关的推送

## 特别注意
1. 通配符方式的topic需要修改REGEXP_MAP的定义
