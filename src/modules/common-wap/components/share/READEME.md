# 分享组件说明
**重点说明，请勿随便自己重新编写分享组件，尽量调用公共的分享组件，功能不够请提意见并修改**

## 调用方法

``` html
	<Share
		:shareCfg=shareCfg @close-share="close" @succ-share="succ" @click-share="click-share"/>

```

## 参数说明

``` javascript
	shareCfg: {
		text: '', // 全局text 如果配置中没有text将会用这个替代  shareText别名
		url: '', // 全局url，如果配置中没有url将会用这个替代    shareUrl别名
		quote: '', // 默认quote，只有fb用到
		hashtag: '', // 默认hashTag， twitter和fb用到
		via: '', // 只有twitter用到

		fb: {
			url: '', // 分享地址 shareUrl是别名
			hashtag: '', // 分享的hashtag必须以#开头，如果不写，系统自动补全，如：#SportyBet
			quote: '' // 在分享中添加一段文案，注意一旦开启，将无法展示大图
		},
		twitter: {
			text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
			via: '', // 增加一个@xxx的在分享中,并且会弹出是否follow这个用户 如sportybet
			hashtag: '', // 增加一个hashtag，不需要以#号开始
			url: '' // shareUrl, url, href是别名
		},
		whatsapp: {
			text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
			url: '', // shareUrl, url是别名 分享url
			shareContent: '', // 分享文案， 如果提供了shareContent text和href就无效
		}
	}
```



> 如果没有配置其中的一个对象，则该分享会被隐藏，比如配置中没有**fb**对象,则facebook的分享将会消失
>
> 如果三个对象都没有配置，只配置了 text和href则会认为三个分享都存在，用默认的text和href进行分享操作
> 配置对象但是没有配置值，会用外层的默认值



## 事件说明

- **close-share** 关闭分享弹窗的事件，无参数
- **succ-share(type)** 分享成功的时间（目前只有FB有该事件)

  - 参数说明**type  String**类型 表示分享成功的是哪个 FB表示facebook,其他分享暂无成功回调
- **click-share(type)** 分享按钮被点击的时候调用
  - 参数说明 **type String**类型  表示分享按钮被点击时候的事件  FB表示facebook， twitter表示twitter，whatsapp表示whatsapp
- **cancel-share()** 取消分享，在点击蒙层或者点击关闭，或者fb回调为关闭的时候调用，whatsapp和twitter没有

> 分享成功只有fb有，分享取消是指在用户手动关闭分享弹窗的时候调用，分享关闭是指任何关闭弹窗的行为都算，包括系统关闭 


## 针对分享地址需要动态传递的说明

> 对于地址是动态的需求可以对share的组件进行包装出另外的share组件,如
<!--我是包装后的share-->

```html
<template>
	<otherShare  @close-share="close" @succ-share="succ" @click-share="click-share"/>
</template>
```

``` html
<!--我是包装share的代码-->
<!--我包装了share组件，并进行一些数据的处理-->
<template>
    <div>
    	<share  :shareCfg=shareCfg @close-share="close" @succ-share="succ" @click-share="click-share"/>
    </div>
</template>
```



``` javascript
	import share from 'components/share';

	export default {
		components: {
			share
		},
		data() {
			return {
				shareCfg: {
					text: '', // 全局text 如果配置中没有text将会用这个替代  shareText别名
					url: '', // 全局url，如果配置中没有url将会用这个替代    shareUrl别名
					quote: '', // 默认quote，只有fb用到
					hashtag: '', // 默认hashTag， twitter和fb用到
					via: '', // 只有twitter用到

					fb: {
						url: '', // 分享地址 shareUrl是别名
						hashtag: '', // 分享的hashtag必须以#开头，如果不写，系统自动补全，如：#SportyBet
						quote: '' // 在分享中添加一段文案，注意一旦开启，将无法展示大图
					},
					twitter: {
						text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
						via: '', // 增加一个@xxx的在分享中,并且会弹出是否follow这个用户 如sportybet
						hashtag: '', // 增加一个hashtag，不需要以#号开始
						url: '' // shareUrl, url, href是别名
					},
					whatsapp: {
						text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
						url: '', // shareUrl, url是别名 分享url
						shareContent: '', // 分享文案， 如果提供了shareContent text和href就无效
					}
				}
			};
		}
	};

```

