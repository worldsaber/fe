<#compress>
<#include "core/core.ftl">
<@docHead title="help" activeTab="" activeSubTab="">
  <link rel="stylesheet" href="./help.less">
</@docHead>

<div class="s-page">
  <div class="m-main">
    <div class="m-container">
		<#if (country == 'ke')>
			<#include "./ke/help.ftl"/>
		<#elseif (country == 'ng')>
			<#include "./ng/help.ftl"/>
		<#elseif (country == 'gh')>
			<#include "./gh/help.ftl"/>
		<#else>
			<#include "./ke/help.ftl"/>
		</#if>
    </div>
  </div>
</div>
<@docFoot>
</@docFoot>
</#compress>
