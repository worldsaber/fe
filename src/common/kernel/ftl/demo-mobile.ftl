<#compress>
<#-- 设置全局变量 -->
<#assign isLogin = currentLoginUserName!"" != ""/>
<#assign appid = "caipiao"/>

<#-- 引入核心组件 -->
<#include "./mobile.ftl"/>

<#-- 包装docHead和docFoot -->
<#macro docHead title="" keywords="" description="" css=[] namespace="" vml=false xFrame="" bodyClass="" bodyStyle="" canonical="" agent=[] robots=false meta={} webviewTitle="网易彩票">
	<@docHeadCore
		domain="caipiao.163.com"
		title=title
		keywords=keywords
		description=description
		css=css
		namespace=namespace
		vml=vml
		xFrame=xFrame
		xFrameJS="/js2/xframe.js"
		bodyClass=bodyClass
		canonical=canonical
		agent=agent
		robots=robots
		touchIcon=""
		webviewTitle=webviewTitle
		meta=meta
		bodyStyle=bodyStyle
	/>
</#macro>

<#macro docFoot js=[] delayJS=[] clickStat=true mockjax=[] pageStatPercent=0>
	<div id="docFoot">
		<!--这里是项目docFoot代码-->
	</div>
	<@docFootCore
		js=js
		delayJS=delayJS
		appid=appid
		frameAppId="cpframe"
		clickStat=clickStat
		<#-- 需要手工添加 mockjax、mockjax/mock 两个基础库，并补全路径 -->
		mockjaxLib=["mockjax", "mockjax/mock"]
		mockjax=mockjax
		pageStatPercent=pageStatPercent
	/>
</#macro>
</#compress>
