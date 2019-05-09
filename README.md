# 项目说明

## Eslint 代码规范
查看[本项目相关说明](./ESLINT-RULES.md)

## iconffont说明
> iconfont账号和密码（http://www.iconfont.cn/）

账号                 | 密码
------------------ | -----------
aficonfont@126.com | icon163.com


## 页面全局变量说明

- window.v_store、window.v_router

	页面入口文件中，如果包含store或者router，需要将store和router设置到window上，（分别为window.v_store、window.v_router）

- 需要登录的接口，未登录http code为401，最终数据处理成了{ login: false }
- 所有新添加的登录方式，都需要在登录成功后，将用户账号，写入cookie的phone字段中
- 能够投注的页面，需要添加import { userPushInit } from 'base/js/userPush'; 并且调用userPushInit();


## ftl全局变量
ftl全局变量写在 `/common/kernel/base-conf.ftl`

1. 已经存在变量
	- cdnBaseURl 当前cdnBaseUrl
	- cdnUrl 当前cdn的完整url
	- domian 当前域名
	- baseUrl 不同国家显示不同的url

## 项目模块说明
1. 项目下 modules目录下的代码所有模块，每个模块可以认为是一个完成的项目
2. 模块下可以有自己的common，在common中有自己的组件和公共
3. 模块下应该分mobile和desktop2个目录分别标记 桌面版本和移动版本，即使没有其中一个版本也应该有2个目录
4. 模块与模块之间可以有公共内容，请放在 modules下的common目录下，分desktop和mobile放

## 项目编译说明
1. 项目编译全部在miaow-config中
2. entries下每个目录代表每个模块的入口文件，可以在json文件中添加新的入口文件,入口文件路径均相对于src目录
3. 模块下的country代表每个国家的编译代码
	- 每个国家的编译代码下面会有每个模块的编译配置
	- 添加新的国家需要建立国家的目录，然后在国家的目录添加对应的模块,sw模块是serviceWorder模块是必须的模块
4. 项目可以通过npm run start编译，可以带国家参数，或者模块参数  如  `npm run start -- -c=ke -m=bingo`，即编译ke国家下的bingo模块

## layout说明

### desktop

- 辅助的mock数据放在mockData/assist目录下，如广告之类的

- 页面公用数据
	* loginStatus boolean
	* showCurrency string 页面显示
	* currency string 前后端传递使用

- less中iconfont的定义规则：不能和base/style/icon.less中的class同名

- layout组件位置

	 desktop/common/components/layout/main.vue

-  layout组件插槽
	* left 如 `<div slot="left" width>我是左边的内容</div>`
	* right 如 `<div slot="right" width>我是右边的内容</div>`
	* mid 如 `<div slot="mid" width>我是中间的内容</div>`

- layout组件属性
	* leftWidth 左边模块的宽度
	* rightWidth 右边模块的宽度

- 调用方法

``` html
	<Layout leftWidth="30px" rightWidth="30px">
		<div slot="left" width>我是左边的内容</div>
		<div slot="right" width>我是右边的内容- 我的默认值是betslipt等模块-如果不给就默认显示</div>
		<div slot="mid" width>我是中间的内容-我的默认值是router-view,可以直接通过路由改变我的内容</div>
	<Layout>
```

``` javascript

import Layout from 'components/layout/main.vue'

export default {
	components: {
		Layout
	}

}

```

- 登录mixin
提了一个公共的vue mixin

```js
import loginMixin from 'base/js/loginMixin';
...
// 校验及登录
if (!this.checkLogin()) return false;
```

### mobile

- layout组件位置

	 mobile/common/components/layout/main.vue

-  layout组件插槽
	* left 如 `<div slot="left" width>我是左边的内容</div>`
	* right 如 `<div slot="right" width>我是右边的内容</div>`
	* mid 如 `<div slot="mid" width>我是中间的内容</div>`

- layout组件store数据
	* stor数据在stroe/layout
	* 通过stroe可以控制 左侧显示隐藏，右侧显示隐藏，整个页面的加载状态, 可以以首页为参考开发新的页面

- 调用方法

``` html
	<Layout leftWidth="30px" rightWidth="30px">
		<div slot="left" width>我是左边的内容, 我的默认值是az-menu模块</div>
		<div slot="right" width>我是右边的内容- 我的默认值是betslipt模块</div>
		<div slot="mid" width>我是中间的内容-我的默认值是router-view,可以直接通过路由改变我的内容</div>
	<Layout>
```

``` javascript

import Layout from 'components/layout/main.vue'

export default {
	components: {
		Layout
	}

}

```

- **注意事项**
layout组件已进入是loaing状态，需要自己通过layout的store注入toggleLayout方法取改变状态



## mixins说明



## rem计算说明
在mobile/common/base/style/variable.less中有变量@rem，
计算时候从交互中取到大小然后除以@rem 如。750/@rem;


## html, htm文件说明
html和htm文件会自动成为入口加入编译，其中src引入的资源会自动寻路(除js)


## 统计相关问题
- 所有url地址后跟  source=参数名称 表示统计标识参数
- 所有虚拟统计的url地址跟上 /click/的连接

### 章鱼统计已加虚拟链接
- cashout
    - /ke/m/click/cashout 用户点击cashout，并且是可以cashout情况下
    - /ke/m/click/partialcashout 用户点击partialcashout，并且是可以partialcashout情况下
- navbar
    - /ke/m/click/navbar/login  从顶部调用登录
- betslip
    - /ke/m/click/betslip/login 从betslip中调用登录
- jackpot
    -/ke/m/click/jackpot/login  从jackpot中调用登录

### 注册路径
1. /ke/m/click/poplogin/enterMobile (注册弹窗输入手机号码)
2. /ke/m/click/poplogin/pwdSet (注册弹窗设置密码)
3. /ke/m/click/poplogin/codeVerify (注册弹窗校验码)
4. /ke/m/click/poplogin/regFinish (注册弹窗注册成功)

### Sitemap 站点地图编辑说明
请前往 `/packages/sitemap` 编辑修改，并生成新的 `sitemap_sportybet.xml` 配置
