<#compress>
<#-- 引入公共的Core -->
<#include "kernel/ftl/desktop.ftl">

<#include "./ftl/header.ftl">
<#include "./ftl/footer.ftl">
<#include "./ftl/confgGlobalJS.ftl">

<#-- 包装docHead和docFoot -->
<#macro docHead title="" keywords="" description="" namespace="" vml=false xFrame="" bodyClass="" bodyStyle="" canonical="" agent=[] robots=false meta={} activeTab="sports" activeSubTab="home" needNavigator=true needSysNot=false>
	<@docHeadCore
		domain="${request.serverName!www.sportybet.com}"
		title=title
		keywords=keywords
		description=description
		css= []
		js= []
		namespace=namespace
		vml=vml
		xFrame=xFrame
		xFrameJS=""
		bodyClass=bodyClass
		canonical=canonical
		agent=agent
		robots=robots
		meta=meta
		bodyStyle=bodyStyle
		favicon="${cdnUrl}logo/favicon.ico"
	>
	<script type="text/javascript" src="//${domain}${baseUrl}globalConfig.html"></script>
	<!--[if lte IE 9]>
    <script type="text/javascript" src="${cdnUrl}third-lib/classlist.2ac35fe294"></script>
    <![endif]-->
	<@confgGlobalJS/>
	<link rel="stylesheet" href="./core.less">
		<#nested>
	</@docHeadCore>
	<#if needSysNot>
		<link rel="stylesheet" href="./style/note.less" />
	</#if>
	<#if needNavigator>
		<@header currentTab=activeTab activeSubTab=activeSubTab needSysNot=needSysNot />
	</#if>
</#macro>
<#macro docFoot needFooter=true>
	<#if needFooter>
		<@footer></@footer>
	</#if>
	<@__inject_common_scripts__/>
	<@__inject_entry_scripts__/>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113009458-1"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-113009458-1', {
			'linker': {
				'domains': ['easebet.com', 'www.sportybet.com']
			},
			'sample_rate': 10
		});

	</script>

	<@docFootCore js = []></@docFootCore>
</#macro>
</#compress>
