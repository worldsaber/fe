<#compress>
<#--
	全局输出ftl的参数
	该文件将会被当成js文件输出，所以里面只可以拥有  var a = 'a' 这种的变量定义
	目前pc站和wap站公用一个配置，如果后期有必要可以拆分成多个配置
	该ftl目前不被编译是直接被拷贝过去的
	注意这里只能初始化js用的变量不能初始化其他的
	注意这里数字类型如果除10000就需要取默认值是0，如果没有传递的话
-->

<#assign request = request!requestReferenceForFreemarker!(Request["org.springframework.web.context.request.RequestContextListener.REQUEST_ATTRIBUTES"].request)/>
<#--  域名  -->
<#assign domain=request.serverName!"www.sportybet.com">

<#--  登录状态输出  -->
<#--  所有ftl页面应该也会有这个ftl变量，可以直接调用  -->
var loginStatus = ${authenticated!'false'};

<#--  是否注册serviceWorker  -->
var regSW = true;

<#--  这些为关键参数，如果服务器端不出现，则出错  -->
var operId = '${operId!''}';

<#--  真实体育配置  -->
var sportsCfg = {
	min: '${((rsgMinBet!0)?number/10000)?c}',
	max: '${((rsgMaxBet!0)?number/10000)?c}',
	potWinMax: '${((potWinMax!0)?number/10000)?c}'
};
<#--  jackpot配置  -->
var jackpotCfg = {
	min: '${((jpMinBet!0)?number/10000)?c}'
};

<#--  cashout 配置  -->
var cashoutCfg = {
	min: '${cashoutMin!0}',
	max: '${cashoutMax!0}'
}
<#-- 充值配置 -->
var depositCfg = {
	min: '${((depositMin!0)?number/10000)?c}',
	max: '${((depositMax!0)?number/10000)?c}'
}

<#-- 提现配置 -->
var withdrawCfg = {
	min: '${((withdrawMin!0)?number/10000)?c}',
	max: '${((withdrawMax!0)?number/10000)?c}',
	fee: '${((withdrawOnceFee!0)?number/10000)?c}',
	feeThreshold: '${((withdrawFreeMinAmount!0)?number/10000)?c}',
	withdrawCancelFee: '${((withdrawCancelFee!0)?number/10000)?c}',
	partnerDepositCommission: '${(partnerDepositCommission!'')?no_esc}',
	partnerWithdrawFee: '${(partnerWithdrawFee!'')?no_esc}'
}

<#-- 重置提现每日限额 -->
var transThreshold = '${((withdrawDailyMax!0)?number/10000)?c}';

<#-- bonus配置 -->
var bonusCfg = {
	max: '${((bonusMax!0)?number/10000)?c}'
}

<#-- flexibet 配置 -->
var flexiCfg = {
	oddsThreshold: '${((flexibleMinOdds!0)?number/10000)?c}'
}

<#-- odds boost -->
var boostCfg = {
	oddsThreshold: '${((oddsBoostRatio!0)?number/10000)?c}'
}

<#--  国家  -->
var country = (__baseUrl__).replace(/\//g, '');

<#--  ip所在国家  -->
var ipCountry = '${request.getHeader("current-country")!''}';

<#-- 分享用title -->
var shareTitle = '${fbShareTitle!''}'
</#compress>
