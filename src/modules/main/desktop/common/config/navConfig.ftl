<#--
	导航字段：
	name：页面显示名称
	key： 配置的路由name，匹配router的关键字
	href： 页面url
	subNav: 以及导航下含有的二级导航项，数组，各项为二级导航的key
	pageKey: 一级导航或者二级导航对应的key，不是匹配router的关键字
-->
<#--
	路由中需要的参数时，必须配置相关字段
	eg： sportId用于配置router中的sportName字段

	特殊字段特殊配置，需要在/core/header.js改tab切换部分路由的设置部分
 -->

<#--  logo  -->
<#macro logo>
	<div class="m-image-wrapper m-image-country ${country}">
		<#if country == 'ke'>
			<img src="core/image/flagKenya.png" alt="kenya">
		<#elseif country == 'ng'>
			<img src="core/image/flagNigeria.png" alt="ng">
		<#elseif country == 'gh'>
			<img src="core/image/flagGhana.png" alt="gh">
		</#if>
	</div>
</#macro>


<#-- navList 一级导航 -->
<#assign navList = [{
			"name": "Sports",
			"pageKey": "sports",
			"href": "${baseUrl}"
		},{
			"name": "Live Betting",
			"pageKey": "liveBetting",
			"href": "${baseUrl}sport/live/"
		}, {
			"name": "Virtuals",
			"pageKey": "virtuals",
			"href": "${baseUrl}virtual/"
		},{
			"name": "Jackpot",
			"pageKey": "jackpot",
			"href": "${baseUrl}jackpot/"
		},{
			"name": "Livescore",
			"pageKey": "Livescore",
			"isNewTab": true,
			"href": "https://livescore.sportybet.com/"
		},{
			"name": "Results",
			"pageKey": "results",
			"href": "${baseUrl}liveResult/"
		},{
			"name": "Promotions",
			"pageKey": "promotions",
			"href": "${baseUrl}promotions/"
		},{
			"name": "App",
			"pageKey": "mobile",
			"href": "${baseUrl}mobile/"
		}]
/>
<#if country == 'ke' || country == 'gh'>
	<#assign navList = [{
			"name": "Sports",
			"pageKey": "sports",
			"href": "${baseUrl}"
		},{
			"name": "Live Betting",
			"pageKey": "liveBetting",
			"href": "${baseUrl}sport/live/"
		}, {
			"name": "Virtuals",
			"pageKey": "virtuals",
			"href": "${baseUrl}virtual/"
		}, {
			"name": "Jackpot",
			"pageKey": "jackpot",
			"href": "${baseUrl}jackpot/"
		},{
			"name": "Livescore",
			"pageKey": "Livescore",
			"isNewTab": true,
			"href": "https://livescore.sportybet.com/"
		},{
			"name": "Results",
			"pageKey": "results",
			"href": "${baseUrl}liveResult/"
		},{
			"name": "Promotions",
			"pageKey": "promotions",
			"href": "${baseUrl}promotions/"
		},{
			"name": "App",
			"pageKey": "mobile",
			"href": "${baseUrl}mobile/"
		}]
/>
</#if>

<#-- 一级导航下包含的二级导航项 -->
<#assign navSubMap = {
	"sports": ["home", "football", "basketball", "tennis", "rugby", "cricket", "volleyball", "iceHockey", "handball" "darts", "beachVolley"],
	"Live Betting": ["multi view", "single view", "schedule"]
}
/>

<#-- 二级导航 -->
<#assign subNavList = {
			"home": {
				"name": "Home",
				"key": "home",
				"href": "${baseUrl}"
			},
			"football": {
				"name": "Football",
				"key": "eventListDefault",
				"sportId": 1,
				"href": "${baseUrl}sport/football/"
			},
			"basketball": {
				"name": "Basketball",
				"key": "eventListDefault",
				"sportId": 2,
				"href": "${baseUrl}sport/basketball/"
			},
			"tennis": {
				"name": "Tennis",
				"key": "eventListDefault",
				"sportId": 5,
				"href": "${baseUrl}sport/tennis/"
			},
			"rugby": {
				"name": "Rugby",
				"key": "eventListDefault",
				"sportId": 12,
				"href": "${baseUrl}sport/rugby/"
			},
			"cricket": {
				"name": "Cricket",
				"key": "eventListDefault",
				"sportId": 21,
				"href": "${baseUrl}sport/cricket/"
			},
			"volleyball": {
				"name": "Volleyball",
				"key": "eventListDefault",
				"sportId": 23,
				"href": "${baseUrl}sport/volleyball/"
			},
			"iceHockey": {
				"name": "Ice Hockey",
				"key": "eventListDefault",
				"sportId": 4,
				"href": "${baseUrl}sport/iceHockey/"
			},
			"handball": {
				"name": "Handball",
				"key": "eventListDefault",
				"sportId": 6,
				"href": "${baseUrl}sport/handball/"
			},
			"darts": {
				"name": "Darts",
				"key": "eventListDefault",
				"sportId": 22,
				"href": "${baseUrl}sport/darts/"
			},
			"beachVolley": {
				"name": "Beach Volley",
				"key": "eventListDefault",
				"sportId": 34,
				"href": "${baseUrl}sport/beachVolley/"
			},
			"multi view": {
				"name": "Multi View",
				"key": "overview",
				"sportId": 1,
				"href": "${baseUrl}sport/football/live_list/"
			},
			"single view": {
				"name": "Single View",
				"key": "eventViewDefault",
				"href": "${baseUrl}sport/live/"
			},
			"schedule": {
				"name": "Schedule",
				"key": "schedule",
				"sportId": 1,
				"href": "${baseUrl}sport/football/live_schedule/"
			}
		}
/>

<#assign supportSms = [
	"ke"
] />

<#function checkSupportSms>
	<#list supportSms as item>
		<#if country == item>
			<#return true>
		</#if>
	</#list>
	<#return false>
</#function>
