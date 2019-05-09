<#compress>
<#include "core/core.ftl">
<#if (request.requestURL!"")?contains('live_list')>
    <@docHead title= 'Live ' + getGameName(false) + ' scores,results and fixture today games - Sportybet.com' keywords= 'Living matches, overview, all sports, living score, living time.' description= getGameName(true) + ' live scores and results service at Sportybet offers scores from today ' + getGameName(false) + ' games. Livescore, results, standings, lineups and match details.'>
    </@docHead>
<#elseif (request.requestURL!"")?contains('live_schedule')>
    <@docHead title='Live ' + getGameName(false) + ' scores today and Tomorrow games - Sportybet.com' keywords="Live matches, schedule, hot games" description= 'All today and Tomorrow ' + getGameName(false) + ' matches,' + getGameName(false) + 'live scores from all ' + getGameName(false) +' leagues in the world at Sportybet . Most exciting living betting, one second betting, one second reward!'>
    </@docHead>
<#else>	
    <@docHead title= 'Live ' + getGameName(false) + ' scores,results and fixture today games - Sportybet.com' keywords= 'Live match, detail markets, betting, live tracker, live streaming.' description= "Sportybet give livecore of today's " + getGameName(false) + " match,Most exciting living betting, one second betting, one second reward!">
    </@docHead>
</#if>
	<div id="app"></div>
<@docFoot>
</@docFoot>
</#compress>
