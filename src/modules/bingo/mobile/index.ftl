<#compress>
<#include "core/core.ftl">
<#if country == "ke">
	<#assign fbSharePic="//s.sporty.net/ke/main/res/1397cb244a2f3e69fa53b28571679bc4.jpg"/>
	<#elseif country == "ng">
	<#assign fbSharePic="//s.sporty.net/ng/main/res/1397cb244a2f3e69fa53b28571679bc4.jpg"/>
</#if>
<#assign fbShareDesc="Your bets count the most at SportyBet" />
<#assign fbShareTitle="Try out Bingo! Bingo!" />

<#-- seo: title, keywords, description -->
<#if country == 'ng'>
	<#-- Nigeria -->
	<#assign keywords="Sporty Bingo, Bingo, Lucky Bingo, Win, NGN 1, Bonus, Game, Gamble, Bet, Play, Gift" />
	<#assign description="Welcome to Sporty Bingo! Here you can EASY WINNING up to NGN 3,000,000. Deposit Gift for New Player." />
<#else>
	<#-- 默认 Kenya -->
	<#assign keywords="Sporty Bingo, Bingo, Lucky Bingo, Win, KSh 1, Bonus, Game, Gamble, Bet, Play, Gift" />
	<#assign description="Welcome to Sporty Bingo! Here you can EASY WINNING up to KSh 1,000,000. Deposit Gift for New Player." />
</#if>

<@docHead
	title="Sportybet Bingo"
	keywords="${keywords}"
	description="${description}">
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
