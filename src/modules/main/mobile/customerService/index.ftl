<#compress>
<#include "core/core.ftl">
<@docHead title="Customer Service" keywords="Customer Service" description="Customer Service">
</@docHead>
	<div id="app"></div>
	<#if country == 'ke'>
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=512afc8b-2d49-4e49-bc6f-b3b6fbdd4617"> </script>
	<#elseif country == 'ng'>
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=1692604f-41cd-41c4-a19d-e306f7f197fa"> </script>
	<#elseif country == 'gh'>
		<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=e1cc0661-f7fd-4966-b850-3f06d5703e69"> </script>
	</#if>

	<script>
		/*<![CDATA[*/
			window.zESettings = {
				webWidget: {
					launcher: {
						chatLabel: {
							'*': 'Chat now'
						}
					},
					chat: {
						suppress: false
					},
					helpCenter: {
						suppress: false
					}
 				}
			};
			zE(function() {
				zE.setLocale('english');
				zE.hide();
				zE.activate();
				document.querySelector('#pageLoading').style.display = 'none';
			});
		/*]]>*/
	</script>
	<!-- End of sportybetkenya Zendesk Widget script -->
<@docFoot>
</@docFoot>
</#compress>
