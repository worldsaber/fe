<#compress>
<#include "core/core.ftl">
<#include "core/ftl/pageLoading.ftl">

<@docHead
	title="Online Sports Betting ${countryName} & Live Betting Odds at Sportybet.com"
	keywords="Sports Betting, Online Sports Betting, Live odds"
	description="SportyBet offers the best odds, a lite APP with the fastest live betting experience, instant deposits and withdrawals, and great bonuses. Get Sporty, Bet Sporty!"
	namespace="preMatch sports"
	activeTab="sports"
	activeSubTab="home"
	needSysNot=true>
</@docHead>
	<div id="app">
		<@pageLoading />
	</div>
	<script src="https://cs.betradar.com/ls/widgets/?/sportybet2/en/widgetloader/widgets"></script>
	<#if country=="ke">
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=512afc8b-2d49-4e49-bc6f-b3b6fbdd4617"> </script>
		<#elseif country == "ng">
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=1692604f-41cd-41c4-a19d-e306f7f197fa"> </script>
		<#elseif country == "gh">
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=e1cc0661-f7fd-4966-b850-3f06d5703e69"> </script>
	</#if>

	<script>
		zE(function() {
			zE.setLocale('english');
			window.$zopim(() => {
				const $zopim = window.$zopim;
				const livechat = $zopim.livechat;
				const win = livechat.window;
				livechat.departments.filter('');
			});
		});
	</script>
	<#if broadcastInfo??>
		<script>
			var bdcastConf = ${JSON.toJSONString(broadcastInfo.data![])?no_esc};
		</script>
	</#if>
<@docFoot>
<#if __debug__>

</#if>
</@docFoot>
</#compress>
