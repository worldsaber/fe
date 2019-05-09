<#compress>
<#include "core/core.ftl">
<#assign fbShareTitle="SportyBet Football Quiz" />
<#if __baseUrl__ == '/ke/'>
	<#assign fbShareDesc="Prize Pool of KES 1,000,000 Cash Gifs ! Join now, get extra Lives !"/>
<#else>
	<#assign fbShareDesc="Prize Pool of NGN 3,000,000 Cash Gifs! Join now, get extra Lives !"/>
</#if>
<@docHead
	title="SportyBet Football Quiz"
	keywords="Football Quiz, World Cup betting promotions,  Betting Prize Pool"
	description="SportyBet Football Quiz is a quiz game. You just need to answer correctly to get a share of the Prize Pool. ">
		<script>
		window.NRUM = window.NRUM || {};
		window.NRUM.config = {key:'a611d275d0a64da8e9a350b76340c3ce',clientStart: +new Date()};
		(function() {var n = document.getElementsByTagName('script')[0],s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = '//nos.netease.com/apmsdk/napm-web-min-1.1.6.js';n.parentNode.insertBefore(s, n);})();
		</script>
</@docHead>
	<div id="app"></div>
<@docFoot>
</@docFoot>
</#compress>
