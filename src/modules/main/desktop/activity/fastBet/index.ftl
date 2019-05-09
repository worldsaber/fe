<#compress>
<#include "core/core.ftl">
<#include "core/ftl/pageLoading.ftl">
<@docHead
	title="instant betting"
	keywords="instant，betting，easy，fast，quick，stake"
	description="convenient place to instant betting"
	needNavigator=false
	meta={
		"viewport":"width=device-width,target-densitydpi=high-dpi,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui",
		"apple-mobile-web-app-capable":"yes",
		"apple-mobile-web-app-status-bar-style":"black",
		"apple-mobile-web-app-title":"sportybet",
		"theme-color":"#0D9737",
		"telephone=no":"format-detection"
		}>
</@docHead>
	<div id="app">
		<@pageLoading />
		<div class="notice">Get ${countryConfig.currency} 50 Free Bet</div>
	</div>
	<div id="appWrap" style="display:none;"></div>
	<style>
		#app {
			width: 320px;
			height: 360px;
			background: #1c1e26;
			display:flex;
			flex-direction:column;
		}

		.notice{
			margin-top:40px;
			color:#fff;
			font-family: Roboto;
			font-size: 18px;
			font-weight: bold;
			letter-spacing: 0.3px;
		}
	</style>
<@docFoot needFooter=false>
	<#if __debug__>

	</#if>
	<!-- Facebook Pixel Code -->
	<script>
	!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '339701989854323');
	fbq('track', 'PageView');
	</script>
	<noscript><img height="1" width="1" style="display:none"
	src="https://www.facebook.com/tr?id=339701989854323&ev=PageView&noscript=1"
	/></noscript>
	<!-- End Facebook Pixel Code -->
</@docFoot>
</#compress>
