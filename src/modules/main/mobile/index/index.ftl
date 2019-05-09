<#compress>
<#include "core/core.ftl">

<@docHead
	title="Online Sports Betting ${countryName} & Live Betting Odds at Sportybet.com"
	keywords="Sports Betting, Online Sports Betting, Live odds"
	description="SportyBet offers the best odds, a lite APP with the fastest live betting experience, instant deposits and withdrawals, and great bonuses. Get Sporty, Bet Sporty!">
</@docHead>

	<div id="app"></div>
	<#if broadcastInfo??>
		<script>
			var bdcastConf = ${JSON.toJSONString(broadcastInfo.data![])?no_esc};
		</script>
	</#if>
<@docFoot>
</@docFoot>
</#compress>
