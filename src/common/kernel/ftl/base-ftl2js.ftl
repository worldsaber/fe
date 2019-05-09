<#------------  flt数据转化成js数据 ----------->
<#-- 2015/9/23 by yychen -->
<#-- 功能
	支持sequence、hash、number、string、Boolean型ftl数据转换为js数据
	注意：目前只支持hash的第一层关键字筛选输出
-->
<#-- 使用方法 
	直接调用宏
	<@ftl2js ftldata=ftldata keepKeyList=["gameEn"]/>
	使用表达式输出
	1、输出js对象，等同ftl2js方法
	${ftl2js_Obj(ftldata,[keepKeyList])}
	2、输出字符串
	${ftl2js_Str(ftldata,[keepKeyList])}
	
	ftldata		需要转换的ftl数据
	keepKeyList	hash表中需要保留下来的key，支持一下两种格式
		keepKeyList = ['key1','key1','key2']
		keepKeyList = 'key1,key1,key2'
-->
<#-- 示例
	<#assign dataMap = {"key1":"value1","key2":123.5,"key3":["value3_1","value3_2"],"key4":false}>
	<#assign dataList = ["a","b","c",{"key1":"value1","key2":123.5}]>

	<@ftl2js ftldata=dataMap/> <br />
	${ftl2js_Obj(dataMap)} <br />
	${ftl2js_Str(dataList)} <br />
	${ftl2js_Obj(dataMap+{"key5":dataList})} <br />

	<@ftl2js ftldata=dataMap keepKeyList=['key1','key2']/> <br />
	${ftl2js_Obj(dataMap,'key1, key2')} <br />
	${ftl2js_Str(dataList,['key1','key2'])} <br />
-->
<@compress ingle_line = true>
<#macro ftl2js ftldata='数据为空' keepKeyList=[]>
<#global keepKeys = (keepKeyList?is_sequence)?then(keepKeyList,keepKeyList?replace(" ","")?split(","))/>
<#global haskeepKeys = keepKeys?size gt 0/>
<#if ftldata?is_hash>
	<#-- ftl数据是hash -->
	<@getHash hash=ftldata/><#t>
<#elseif ftldata?is_sequence>
	<#-- ftl数据是sequence -->
	<@getSequence sequence=ftldata/><#t>
<#elseif ftldata?is_string>
	<#-- ftl数据是string型 -->
	'${ftldata?replace("\'","\"")}'<#t>
<#else>
	<#-- ftl数据 -->
	${(ftldata!'数据为空')?c}<#t>
</#if>
</#macro>
<#-- 获取数组 -->
<#macro getSequence sequence>
<#list sequence>
	[<#t>
	<#items as list>
		<@ftl2js ftldata = list!'数据为空' keepKeyList = .globals.keepKeys/><#sep>,<#t>
	</#items>
	]<#t>
<#else>
	[]<#t>
</#list>
</#macro>
<#-- 获取哈希 -->
<#macro getHash hash>
<#list .globals.keepKeys>
	<#-- 输出对应自定义关键字的值 -->
	{<#t>
		<#items as key>		
		'${key}':<@ftl2js ftldata = hash[key]!'数据为空' /><#sep>,<#t>
		</#items>
	}<#t>
<#else>
	<#-- 输出所有的值 -->
	<#list hash?keys><#t>
		{<#t>
			<#items as key>		
			'${key}':<@ftl2js ftldata = hash[key]!'数据为空'/><#sep>,<#t>	
			</#items>
		}<#t>
	<#else>
		{}<#t>
	</#list>
</#list>
</#macro>

<#-- 把mcaro封装成方法 -->
<#function Ftl2JsStr ftldata='数据为空' keepKeyList=[]>
	<#local jsString>
		<@ftl2js ftldata=ftldata keepKeyList=keepKeyList/>
	</#local>
	<#return jsString>
</#function>

<#-- 返回js对象 -->
<#function ftl2js_Obj ftldata='数据为空' keepKeyList=[]>	
	<#return Ftl2JsStr(ftldata,keepKeyList)>
</#function>

<#-- 返回js字符串 -->
<#function ftl2js_Str ftldata='数据为空' keepKeyList=[]>	
	<#local str = Ftl2JsStr(ftldata,keepKeyList)>
	<#-- 但返回值已经是string型，不再加“"” -->
	<#return str?ends_with("'")?string(str,'"'+str+'"')>
</#function>

</@compress>