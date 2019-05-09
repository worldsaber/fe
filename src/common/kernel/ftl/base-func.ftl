
<#--
输出js文件 / css文件
-->
<#macro jsFile file=[]>
	<#list file as x><script src="${x}"></script></#list><#t>	
</#macro>

<#macro cssFile file=[]>
	<#list file as x><link rel="stylesheet" href="${x}"/></#list><#t>
</#macro>

<#--
检查地址是否为安全的可访问地址
-->
<#function replaceXSS str="">
	<#return str?replace("<","")?replace(">","") />
</#function>

<#--
检查当前地址是否为某种运动相关并返回运动名称（SEO相关）
-->
<#function getGameName isCapFirst>
    <#local lists=['football', 'basketball', 'tennis', 'rugby', 'cricket']>
	<#local url=request.requestURL!""/>
	<#local value = "football"/>
	<#list lists>
	  <#items as game>
	    <#if url?contains(game!"")>
		  <#local value = game/>
		  <#break/>
		</#if>
	  </#items>
	</#list>
	<#if isCapFirst>
	  <#local value = value?cap_first>
	</#if>
	<#return value />
</#function>

<#--
读取url中的参数
-->
<#function getPara para defaultPara="">
	<#local val = ((Parameters!RequestParameters!{})[para])!(defaultPara!"") />
	<#if val == "">
		<#local val = defaultPara!"" />
	</#if>
	<#return val />
</#function>
<#function getSafePara para defaultPara="">
	<#local val = replaceXSS(getPara(para, defaultPara))?replace("'","")?replace('"',"")/>
	<#return val />
</#function>

<#--
读取cookie
-->
<#function getCookie name=''>
	<#local cookies = []/>
	<#if request??>
		<#local cookies = request.getCookies()![] />
	</#if>
	<#local value = '' />
	<#list cookies as cookie>
		<#if cookie.name == name>
			<#local value = cookie.value />
			<#break/>
		</#if>
	</#list>
	<#return value />
</#function>

<#--
检查地址是否为安全的可访问地址
-->
<#function isSafeUrl url="">
	<#if url?length lte 0>
		<#return false/>
	</#if>
	<#local str = url?lower_case />
	<#-- 仅仅支持返回http类型的url -->
	<#if str?matches("^\\w+://.+") && !str?matches("^https*://.+")>
		<#return false/>
	</#if>
	<#-- 仅仅支持返回网易163.com域名的url -->
    <#--支持不带结尾斜线 原: "^http://[\\w\\.]+?\\.163\\.com\\/.*"-->
	<#if str?matches("^https*://.+") && !str?matches("^https*:\\/\\/[\\w\\.]+?\\.163\\.com(?:$|\\/.*)")>
		<#return false/>
	</#if>
	<#-- 检查路径中是否包含XSS风险的代码 -->
	<#local checkUrl = replaceXSS(url)/>
	<#if checkUrl != url>
		<#return false/>
	</#if>
	<#-- 相对路径和163.com的域名一律通过 -->
	<#return true/>
</#function>


<#-- ftl数据转js数据 -->
<#include "./base-ftl2js.ftl">
