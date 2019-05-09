<#--
判断内嵌客户端类型
-->
<#assign userAgent = request.getHeader("User-Agent")!'' +" "+ request.getHeader("X-Requested-With")!'' />
<#--
判断内嵌客户端类型
-->
<#--  sportybetclient/sportybet/1.1/2 channel/channelname deviceId/XXXXX  -->
<#assign userAgent = (request.getHeader("User-Agent")!'') +" "+ (request.getHeader("X-Requested-With")!'') />
<#assign useragent = userAgent?lower_case />
<#if useragent?index_of("sportybetclient/sportybet") gte 0>
	<#assign webViewName = "sportybet"/>
</#if>

<#--
判断系统类型
-->
<#assign osType = "other"/>
<#if useragent?index_of("android") gt 0 || useragent?index_of("adr ") gt 0>
	<#assign osType = "android"/>
<#elseif useragent?index_of("iphone") gt 0 || useragent?index_of("ipad") gt 0 || useragent?index_of("ipod") gt 0>
	<#assign osType = "ios"/>
</#if>

<#--
判断网络环境
-->
<#function getNetType>
	<#-- 匹配腾讯系或支持NetType的终端 -->
	<#local netTypeRes = useragent?matches(r".*(?:nettype|network)/([^/ ]+).*")>
	<#if !netTypeRes>
		<#-- 匹配电商系 -->
		<#local netTypeRes = useragent?matches(r".*[^/ ]+/[^/ ]+/[\d\.]+/\d+/([012]).*")>
	</#if>

	<#if netTypeRes>
		<#local netType = "highbandwidth" />
		<#if netTypeRes?groups[1] = "1" || netTypeRes?groups[1] = "mobile" || netTypeRes?groups[1] = "2g" || netTypeRes?groups[1] = "3g+">
			<#local netType = "lowbandwidth" />
		</#if>
	</#if>
	<#return netType>
</#function>

<#if getNetType()??>
<#assign netType = getNetType() />
</#if>
