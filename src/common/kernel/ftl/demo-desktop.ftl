<#compress>
<#-- 设置全局变量 -->
<#assign isLogin = currentLoginUserName!"" != ""/>
<#assign appid = "caipiao"/>

<#-- 引入核心组件 -->
<#include "./ftl"/>

<#-- 包装docHead和docFoot -->
<#macro docHead title="" keywords="" description="" css=[] namespace="" vml=false xFrame="" bodyClass="" canonical="" agent=[] robots=false allowIE6=true>
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
		allowIE6=allowIE6
		IE6OutPage="http://caipiao.163.com/ie6out.htm"
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
