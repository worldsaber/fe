<#assign thirdPartyUrl = {
	"ke": {
		"facebook": "https://www.facebook.com/sportybetke",
		"twitter": "https://twitter.com/sportybetke",
		"instagram": "https://www.instagram.com/sportybetke"
	},
	"ng": {
		"facebook": "https://www.facebook.com/sportybetng",
		"twitter": "https://twitter.com/sportybetng",
		"instagram": "https://www.instagram.com/sportybetng"
	},
	"gh": {
		"facebook": "https://www.facebook.com/sportybetgh",
		"twitter": "https://twitter.com/sportybetgh",
		"instagram": "https://www.instagram.com/sportybetgh"
	}
}>

<#function getSharedUrl>
	<#if country == "ke">
		<#return thirdPartyUrl.ke>
	<#elseif country == "ng">
		<#return thirdPartyUrl.ng>
	<#elseif country == "gh">
		<#return thirdPartyUrl.gh>
	</#if>
</#function>
