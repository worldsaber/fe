<#compress>
<#macro sysNot>
	<#if broadcastInfo??>
		<#local data = broadcastInfo.data ![] />
		<#list data as item>
			<#local type = item.groupType!0>
			<#if type == 1>
				<#local infos = item.infos![]>
				<#list infos as sysItem>
					<#if sysItem.text?? >
						<div class="m-note" id="j_note">
							<p>
								<i class="m-icon-tips"></i>
								<span class="t-main">${sysItem.text}<#if sysItem.url??><a href="${sysItem.url}" class="m-more">View more ></a></#if></span>
							</p>
						</div>
						<#break>
					</#if>
				</#list>
			</#if>
		</#list>
	</#if>
</#macro>
</#compress>
