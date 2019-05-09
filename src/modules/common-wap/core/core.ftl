<#compress>
<#-- 引入公共的Core -->
<#include "kernel/ftl/mobile.ftl">
<#include "./ftl/confgGlobalJS.ftl">
<#-- 包装docHead和docFoot -->
<#macro docHead title="" keywords="" description="" namespace="" vml=false xFrame="" bodyClass="" bodyStyle="" canonical="" agent=[] robots=false meta={} webviewTitle="">
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
		touchIcon="${cdnBaseURl}logo/144x144.png"
		webviewTitle=webviewTitle
		meta=meta
		bodyStyle=bodyStyle
		favicon="${cdnBaseURl}logo/favicon.ico"
	>
	<script type="text/javascript" src="//${domain}${baseUrl}m/globalConfig.html"></script>
	<@confgGlobalJS/>
	<link rel="manifest" href="${cdnBaseURl}manifest.json">
	<link rel="stylesheet" href="./core.less">
		<#nested>
	<@pageLoading/>
	</@docHeadCore>
</#macro>
<#macro docFoot>
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
<#macro pageLoading>
	<#-- facebook登录相关，只做引入 -->
	<div class="fb-login-button" data-width="130" data-max-rows="1" data-size="medium" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false" style="display: none;"></div>
	<#-- 正文内容放在一个统一的div中 -->
	<div class="m-page-loading-wrap" id="pageLoading">
		<div class="m-page-loading">
			<div class="loading">Loading...</div>
			<div class="loading-page-fail">
				<p class="fail-text">Data Failed loading. Please reload.</p>
				<div class="fail-btn">Reload</div>
			</div>
		</div>
	</div>
</#macro>
</#compress>
