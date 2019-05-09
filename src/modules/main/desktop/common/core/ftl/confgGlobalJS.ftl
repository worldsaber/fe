<#--  配置全局js变量的ftl  -->
<#compress>
<#macro confgGlobalJS>
<script type="text/javascript">
	<#--  这些变量通过miaow页面配置文件注入  -->
	var appId = '${appid}';
	var currency = '${countryConfig.currency!KES}';
	var showCurrency = '${countryConfig.showCurrency!KSh}';
	var countryCode = '${countryConfig.countryCode!""}';
</script>
</#macro>
</#compress>
