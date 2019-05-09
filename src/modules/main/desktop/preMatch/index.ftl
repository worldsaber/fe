<#compress>
<#include "core/core.ftl">
<#include "core/ftl/pageLoading.ftl">
<#if (request.requestURL!"")?contains('today')>
    <@docHead title=getGameName(true) + ' games Today with odds- Sportybet.com' keywords= getGameName(true) + ' games, ' + getGameName(false) + ' games today' description= getGameName(false) + ' games today with odds, Give you every match you want to bet on and never let you miss even a single one!' namespace="preMatch sports" activeTab="sports" activeSubTab="home">
    </@docHead>
<#elseif (request.requestURL!"")?contains('upcoming')>
    <@docHead title='Upcoming ' + getGameName(false) + ' games and ' + getGameName(false) + ' games tomorrow with odds- Sportybet.com' keywords='Upcoming ' + getGameName(false) + ' games, ' + getGameName(false) + ' games tomorrow' description='Sportybet.com give you Upcoming ' + getGameName(false) + ' games and ' + getGameName(false) + ' games tomorrow with odds 
    have all key matches by our cutting-edge automatic recommendation system.' namespace="preMatch sports" activeTab="sports" activeSubTab="home">
    </@docHead>
<#elseif (request.requestURL!"")?contains('match')>
    <@docHead title = 'Betting Odds|' + getGameName(false) + ' match - Sportybet.com' keywords = getGameName(true) + ' games recently, hot games, best odds, all sports category.' description = 'Find the latest betting odds for United ' + getGameName(false) + ' match with Sportybet. Join Sportybet and customize your account to get the most out of it.' namespace="preMatch sports" activeTab="sports" activeSubTab="home">
    </@docHead>
<#elseif (request.requestURL!"")?contains('category')>
    <@docHead title = getGameName(true) + ' games Today, matches betting - Sportybet.com' keywords = getGameName(false) + ' games today, matches betting' description = "Bet on Today's " + getGameName(false) + " matches with Sportybet . Great odds & excitement from the world's favourite." namespace="preMatch sports" activeTab="sports" activeSubTab="home">
    </@docHead>
<#else>
    <@docHead title= getGameName(true) + ' Betting Odds and ' + getGameName(false) + ' matches today - Sportybet.com' keywords= getGameName(true) + 'Betting, ' + getGameName(false) + 'Betting Odds, ' + getGameName(false) + 'matches, ' + getGameName(false) + 'matches today' description='The best website for ' + getGameName(false) + ' betting ever which provides most comprehensive ' + getGameName(false) + ' coverage.' namespace="preMatch sports" activeTab="sports" activeSubTab="home">
    </@docHead>
</#if>
	<div id="app">
        <@pageLoading />
    </div>
	<script src="https://cs.betradar.com/ls/widgets/?/sportybet2/en/widgetloader/widgets"></script>
<@docFoot>
<#if __debug__>

</#if>
</@docFoot>
</#compress>
