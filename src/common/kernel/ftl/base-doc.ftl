<#--
文档声明/head
支持对head内容项进行修改

*******************************
* 不再鼓励将js输出到docHead中
*******************************
-->
<#macro docHeadCore domain=domain title="" keywords="" description="" css=[] js=[] namespace="" vml=false xFrame="" xFrameJS="" bodyClass="" canonical="" agent=[] robots=false allowIE6=true IE6OutPage="" meta={} metaList=[] bodyStyle="" favicon="/favicon.ico" needMultiNested=false>
	<!DOCTYPE HTML>
	<html lang="en"<#if namespace?length gt 0> ${namespace}</#if>>
	<head>
		<meta charset="UTF-8">
		<#-- 是否启用多插槽（该开关用于兼容旧代码），默认false -->
		<#if needMultiNested><#nested 'top'><#t></#if>
		<script>var _it=[new Date(), "${.now?long?c}", "<!--nginx-server-time-->"];</script>
		<link rel="shortcut icon" href="${favicon}"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="renderer" content="webkit">
		<meta name="application-name" content="${domain}"/>
		<meta name="keywords" content="${keywords}"/>
		<meta name="description" content="${description}"/>
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
		<meta property="og:url" content="${request.scheme}://${domain}" />
        <meta property="og:site_name" content="sportybet" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

		<#--  <script>
			window.NRUM = window.NRUM || {};
			window.NRUM.config = {key:'a611d275d0a64da8e9a350b76340c3ce',clientStart: +new Date()};
			(function() {var n = document.getElementsByTagName('script')[0],s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = '//nos.netease.com/apmsdk/napm-web-min-1.1.6.js';n.parentNode.insertBefore(s, n);})();
		</script>  -->
		<#if meta?size gt 0>
			<#list meta?keys as key><meta name="${key}" content="${meta[key]}"/></#list>
		</#if>
		<#if metaList?size gt 0>
			<#list metaList as metaMap> <meta <#list metaMap?keys as k> ${k}="${metaMap[k]}"</#list> /> </#list>
		</#if>
		<#if xFrame?length gt 0><meta http-equiv="X-Frame-Options" content="${xFrame}"/></#if>
		<#if robots><meta name="robots" content="noindex"></#if><#t>
		<title>${title}</title>
		<#if !allowIE6><!--[if lte IE 8]><meta http-equiv="refresh" content="0;url=${IE6OutPage}"><![endif]--></#if>
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
	<body class="${country} ${bodyClass}" style="${bodyStyle}">
	<#-- No Script -->
	<noscript>
		<div id="noScript">
			<div>
				<p>For full functionality of this site it is necessary to enable JavaScript. Here are the <a href="https://www.enable-javascript.com/" target="_blank">instructions how to enable JavaScript in your web browser</a>.</p>
			</div>
		</div>
	</noscript>
</#macro>

<#-- 通用页脚 -->
<#macro docFootCore js=[]>
	<@jsFile file = js />
	</body>
</html>
</#macro>
