<#compress>
<#include "config/navConfig.ftl">
<#include "./login.ftl">
<#include "./sysNot.ftl">

<#macro header currentTab activeSubTab needSysNot>
	<div class="s-header<#if (authenticated!"false") == "true" > s-header-on</#if>" id="j_page_header">
		<#if needSysNot>
			<@sysNot />
		</#if>
		<div class="m-top-wrapper">
			<div class="m-nav-wrapper">
				<div class="m-logo-bar">
					<@login />
					<a href="${__baseUrl__}" class="m-logo-wrapper">
						<div class="m-image-wrapper">
							<img class="m-img m-img--logo" src="core/image/logo.png" alt="sportyBet">
						</div>
						<@logo/>
					</a>
				</div>
				<div class="m-nav-main m-header-item">
					<a href="${__baseUrl__}" class="m-image-wrapper">
						<img src="core/image/shortLogo.png" alt="">
					</a>
					<nav id="topHeader" class="m-flex">
						<#list navList as item>
							<a
								class="m-flex-item<#if currentTab?lower_case == item.name?lower_case> m-flex-item--active</#if><#if item.name?lower_case == 'app'> m-flex-item--fix</#if>"
								href="${item.href}"
								<#if item.isNewTab??>target="_blank"</#if>
								<#if item.sportId??> data-sportsid="${item.sportId}"</#if>
								<#if item.key??> data-path="${item.key}"</#if>
							>
								<span>${item.name}</span>
								<#--  app new badge  -->
								<#if item.name?lower_case == "app" && currentTab?lower_case != item.name?lower_case>
									<img src="core/image/hotBadge.png" class="m-item-badge" alt="hot">
								</#if>
							</a>
						</#list>
					</nav>
					<div id="j_timezone" class="m-timezone"></div>
				</div>
			</div>
		</div>
		<div class="m-nav-bar">
			<#if navSubMap[currentTab]??>
				<div class="m-nav">
					<div class="m-header-item">
						<nav id="header" class="m-flex">
							<#list navSubMap[currentTab] as subItem>
								<#if subItem?? && subNavList[subItem]??>
									<a
										class="m-flex-item<#if activeSubTab?lower_case == subNavList[subItem].key?lower_case> m-flex-item--active</#if>"
										href="${subNavList[''+subItem].href!}"
										<#if subNavList[''+subItem].sportId??> data-sportsid="${subNavList[''+subItem].sportId}"</#if>
										<#if subNavList[''+subItem].key??> data-path="${subNavList[''+subItem].key!}"</#if>
										data-key="${subItem}"
									>
										${subNavList[''+subItem].name!}
										<#if subNavList[''+subItem]?? >
											<#if subNavList[''+subItem].sportId?? && subNavList[''+subItem].sportId == 21>
												<img src="core/image/new-badge.png" class="new-badge" alt="new" style="display:none">
											</#if>
										</#if>

									</a>
								</#if>
							</#list>
						</nav>
					</div>
				</div>
			</#if>
		</div>
		<div class="fb-login-button" data-width="130" data-max-rows="1" data-size="medium" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false" style="display: none;"></div>
	</div>
</#macro>
</#compress>
