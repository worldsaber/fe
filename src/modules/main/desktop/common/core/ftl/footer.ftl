<#compress>
<#include "./footer/footerKe.ftl" />
<#include "./footer/footerNg.ftl" />
<#include "./footer/footerGh.ftl" />

<#macro footer>
	<#if baseUrl == "/ke/">
		<@footer_ke />
	</#if>

	<#if baseUrl == "/ng/">
		<@footer_ng />
	</#if>

	<#if baseUrl == "/gh/">
		<@footer_gh />
	</#if>
</#macro>
</#compress>
