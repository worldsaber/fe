<#--
全局 request对象
-->
<#assign request = request!requestReferenceForFreemarker!(Request["org.springframework.web.context.request.RequestContextListener.REQUEST_ATTRIBUTES"].request)/>
<#--  将request中的协议替换成https，因为后台不支持，所以只能我们自己替换  -->
<#assign request = request + {
	"requestURL": request.getRequestURL()?starts_with('http://')?string("https" + request.getRequestURL()?substring(4), request.getRequestURL())
}/>
<#--  appid是章鱼统计需要  -->
<#assign appid = appid!"africa"/>

<#--  域名  -->
<#assign domain=request.serverName!"www.sportybet.com">

<#--  由编译工具替换  -->
<#--  整站的baseURl如/ke/  -->
<#assign baseUrl=__baseUrl__/>
<#--  cdnBaseURl  -->
<#assign cdnBaseURl=__cdnBasePath__>
<#--  cdn地址  -->
<#assign cdnUrl=__cdn__>
<#-- 国家相关配置（货币及国家码）-->
<#assign countryConfig=__countryConfig__ />
<#-- facebook分享图片默认配置，先取后台配置，在取前端配置的 -->
<#if operInfo??>
	<#assign fbSharePic=operInfo.facebookSharePic!__fbSharePic__ />
<#else>
	<#assign fbSharePic=__fbSharePic__ />
</#if>
<#assign fbShareTitle=fbShareTitle!"I just placed a bet with SportyBet!" />
<#assign fbShareDesc=fbShareDesc!"Come join me, let's make it count!" />

<#--  添加国家简称，用baseURl获取-如果后期新国家不合适，则用if else编写  -->
<#assign country="${baseUrl?replace('/', '')}"/>

<#assign countryName=countryConfig.countryName/>
