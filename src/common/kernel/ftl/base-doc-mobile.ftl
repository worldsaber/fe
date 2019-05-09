<#--
文档声明/head
支持对head内容项进行修改

*******************************
* 不再鼓励将js输出到docHead中
*******************************
-->
<#macro docHeadCore domain=domain title="" keywords="" description="" css=[] js=[] namespace="" vml=false xFrame="" xFrameJS="" bodyClass="" canonical="" agent=[] robots=false touchIcon="" webviewTitle="" meta={} metaList=[] bodyStyle="" favicon="/favicon.ico"  viewportContent="" needMultiNested=false>
	<!DOCTYPE HTML>
	<html lang="en"<#if namespace?length gt 0> ${namespace}</#if>>
	<head>
		<#-- 是否启用多插槽（该开关用于兼容旧代码），默认false -->
		<#if needMultiNested><#nested 'top'><#t></#if>
		<script>var _it=[new Date(), "${.now?long?c}", "<!--nginx-server-time-->"];</script>
		<link rel="shortcut icon" href="${favicon}"/>
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="${touchIcon}"/>
		<meta charset="utf-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="application-name" content="${domain}"/>
		<meta name="viewport" content="<#if viewportContent?length gt 0>${viewportContent}<#else>width=device-width,target-densitydpi=high-dpi,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui</#if>" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<meta name="apple-mobile-web-app-title" content="sportybet"/>
		<#--  设置谷歌浏览器wap版本头部颜色 必须添加否则pwa检查会不通过 -->
		<meta name="theme-color" content="#F2F2F2">
		<meta content="telephone=no" name="format-detection" />
		<meta name="renderer" content="webkit"/>
		<meta name="keywords" content="${keywords}"/>
		<meta name="description" content="${description}"/>
		<#--  在base-conf中后台回去覆盖fbSharePic变量-在私有代码中也可以覆盖fbSharePic变量  -->
		<meta property="og:image" content="http:${fbSharePic}" />
		<meta property="og:image:secure_url" content="https:${fbSharePic}" />
		<meta property="og:image:type" content="image/png" />
		<#-- 设置fb分享图片宽高 -->
		<#if operInfo?? && operInfo.facebookSharePicHeight?? && operInfo.facebookSharePicWidth??>
			<meta property="og:image:width" content="${operInfo.facebookSharePicWidth}" />
			<meta property="og:image:height" content="${operInfo.facebookSharePicHeight}" />
		</#if>
		<meta property="og:description" content="${fbShareDesc}" />
        <meta property="og:title" content="${fbShareTitle}" />
        <meta property="fb:app_id" content="746045042245360" />
		<#--  <meta property="og:url" content="${request.scheme}://${domain}" />  -->
		<#--  这里不可以设置成主页，如果设置成主页会导致fb的分享只会取首页取 og:image og:title og:description  -->
		<meta property="og:url" content="${request.requestURL!""}" />
        <meta property="og:site_name" content="sportybet" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

		<#--  <script>
		window.NRUM = window.NRUM || {};
		window.NRUM.config = {key:'a611d275d0a64da8e9a350b76340c3ce',clientStart: +new Date()};
		(function() {var n = document.getElementsByTagName('script')[0],s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = '//nos.netease.com/apmsdk/napm-web-min-1.1.6.js';n.parentNode.insertBefore(s, n);})();
		</script>  -->
		<#if meta?size gt 0>
			<#list meta?keys as list><meta name="${list}" content="${meta[list]}"/></#list>
		</#if>
		<#if metaList?size gt 0>
			<#list metaList as metaMap> <meta <#list metaMap?keys as k> ${k}="${metaMap[k]}"</#list> /> </#list>
		</#if>
		<#if xFrame?length gt 0><meta http-equiv="X-Frame-Options" content="${xFrame}"/></#if>
		<#if robots><meta name="robots" content="noindex"></#if><#t>
		<title><#if webViewName?? && webviewTitle?length gt 0>${webviewTitle}<#else>${title}</#if></title>
		<#list agent as list><#t>
		<meta name="mobile-agent" content="<#if !list?contains('format')>format=html5;url=${list}<#else>${list}</#if>">
		</#list><#t>
		<#if canonical != ""><link rel="canonical" href="${canonical}"/></#if>
		<@cssFile file=css/>
		<@jsFile file=js/>
		<#if xFrame == "DENY" && xFrameJS?length gt 0><@jsFile file=[xFrameJS] /></#if><#t>
		<#if !needMultiNested><#nested><#t></#if>
		<#if vml==true><style>v\:line,v\:rect,v\:oval,v\:group,v\:stroke,v\:fill,v\:polyline{behavior:url(#default#VML)}</style></#if>
		<#if needMultiNested><#nested 'bottom'><#t></#if>
	</head>
	<body class="<#if webViewName??>webView </#if>${bodyClass}"
		style="${bodyStyle}"
		id="${webViewName!'notInWebView'}"
		<#if osType??>data-os="${osType}"</#if>
		<#if netType??>data-net="${netType}"</#if>>
		<#-- No Script -->
		<noscript>
			<div id="noScript">
				<h2>Please turn JavaScript on in browser</h2>. Don't know how? <a href="https://www.google.com.hk/search?q=enable+javascript+chrome+&oq=enable+javascript+chrome+"></a>
			</div>
		</noscript>
		<div class="page-content page-content--${country}">
</#macro>

<#-- 通用页脚 -->
<#macro docFootCore js=[]>
	<#-- 正文内容结束的div -->
	</div>
	<div id="touchStrikeLayout" style="position: fixed;left:0;top:0;width:100%;height:100%;z-index:99999;background:#fff;opacity:0;"></div>
	<@jsFile file = js />
	<script>
		window.setTimeout(function(){var l=document.getElementById("touchStrikeLayout");l&&l.parentNode.removeChild(l)},500);
	</script>
	<#nested>
</body>
</html>
</#macro>
