# 核心模块 #

ftlCore包含了一些公共函数、docHead/docFoot等基础宏和函数定义。	
## 升级2.3.25指南
> **2.3.25.jar包 中将自动转义，不需要 用escape, 可以用标签 ?no_esc实现不转义**

### 后端修改
> 后台spring需要修改 bean配置

``` xml
<bean id="freemarkerConfig" class="org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer">
  <property name="freemarkerSettings">
    <props>
      <!-- 可以没有，这个字段指定模式版本 -->
      <prop key="incompatible_improvements">2.3.25</prop>
      <!-- 必须有这个字段，表示 页面不输出错误，直接后台报错 -->
      <prop key="template_exception_handler">rethrow</prop>
      <!-- 必须有这个字段表示 设置输出模式是  html -->
      <prop key="output_format">HTMLOutputFormat()</prop>
      <prop key="default_encoding">UTF-8</prop>
      <prop key="object_wrapper">DefaultObjectWrapper()</prop>
    </props>
  </property>
</bean>
```
### 前端ftl-node 修改
- ftl-node需要升级到2.2.0版本以上
- 项目中run.config.js需要修改 jarVersion字段修改成2.3.25或自定义freemarker的jar包
	- 自定义jar包可以在项目中bower.json配置中新增`fe/freemarker`,可以在`fe/freemarker`项目中增加自己定义的freemarker的jar包
	- run.config.js中可以配置相对路径 如  jarVersion: "./remote/fe.freemarker/self.jar"
- 项目中run.config.js 需要开启 ftlFormat为true，将不兼容旧版 

> 举例说明
``` javascript
var config = {
	start: 'npm run start',
	jarVersion: '2.3.25',
	routes: [{
		test: /(.*)\.\w{10}\.([^\.]+)$/,
		redirect: '$1.$2'
	}],
	ftlFormat: true
};
module.exports = config;
```

## docHead/docFoot ##
提供 docHeadCore / docFootCore 两个公共宏，跟项目无关并提供足够的扩展和灵活性。项目代码中需要包装两个新宏使用： docHead/docFoot。详细见 [demo-desktop.ftl](https://git.ms.netease.com/fe/core/blob/master/ftl/demo-desktop.ftl) 以及 [demo-mobile.ftl](https://git.ms.netease.com/fe/core/blob/master/ftl/demo-mobile.ftl)

## 公共函数 ##

### flt数据转化成js数据 ###
 
**功能**

-  支持sequence、hash、number、string、Boolean型ftl数据转换为js数据 
  
> 注意：目前只支持hash的第一层关键字筛选输出  

**使用方法**
 
直接调用宏

	<@ftl2js ftldata=ftldata keepKeyList=["gameEn"]/>

使用表达式输出

	1、输出js对象，等同ftl2js方法
	${ftl2js_Obj(ftldata,[keepKeyList])}
	2、输出字符串
	${ftl2js_Str(ftldata,[keepKeyList])}

参数说明

	ftldata		需要转换的ftl数据
	keepKeyList	hash表中需要保留下来的key，支持一下两种格式
		keepKeyList = ['key1','key1','key2']
		keepKeyList = 'key1,key1,key2'

示例

	<#assign dataMap = {"key1":"value1","key2":123.5,"key3":["value3_1","value3_2"],"key4":false}>
	<#assign dataList = ["a","b","c",{"key1":"value1","key2":123.5}]>

	<@ftl2js ftldata=dataMap/> <br />
	${ftl2js_Obj(dataMap)} <br />
	${ftl2js_Str(dataList)} <br />
	${ftl2js_Obj(dataMap+{"key5":dataList})} <br />

	<@ftl2js ftldata=dataMap keepKeyList=['key1','key2']/> <br />
	${ftl2js_Obj(dataMap,'key1, key2')} <br />
	${ftl2js_Str(dataList,['key1','key2'])} <br />
输出

	{'key1':'value1','key2':123.5,'key3':['value3_1','value3_2'],'key4':false}
	{'key1':'value1','key2':123.5,'key3':['value3_1','value3_2'],'key4':false}
	"['a','b','c',{'key1':'value1','key2':123.5}]"

	{'key1':'value1','key2':123.5,'key3':['value3_1','value3_2'],'key4':false,'key5':['a','b','c',{'key1':'value1','key2':123.5}]}
	{'key1':'value1','key2':123.5}
	{'key1':'value1','key2':123.5}
	"['a','b','c',{'key1':'value1','key2':123.5}]" 
