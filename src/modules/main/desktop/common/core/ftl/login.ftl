<#compress>
<#include "config/navConfig.ftl">

<#macro login>
	<div class="m-login-bar<#if (authenticated!"false") == "true" > m-login-bar-fix</#if>">
		<div class="m-info">
			<div class="m-bablance-wrapper">
				<span class="m-text m-balance" id="j_balance"></span>
				<i class="m-icon-toggle on" id="j_toggleBalance"></i>
				<i class="m-icon-refresh" id="j_refreshBalance"></i>
			</div>
			<a class="m-text m-deposit" href="${baseUrl}my_accounts/deposit/">Deposit</a>
			<div class="m-text m-history" id="j_betHistory">
				<a href="${baseUrl}my_accounts/bet_history/sport_bets?isSettled=10">Bet History</a>
				<div class="tips-wrapper"></div>
			</div>
			<div class="m-text m-userInfo" id="j_userInfo">
				<span>My Account</span>
				<div class="dropDown-wraper"></div>
			</div>
			<!-- <span class="m-text" id="j_logout">Log out</span> -->
		</div>
		<div class="m-opt">
			<div class="m-error-toast"></div>
			<div class="m-phone-wrapper">
				<div class="m-phone">
					<span>+${countryConfig.countryCode}</span>
					<input type="text" name="phone" value="" autocomplete="off" placeholder="Mobile Number"/>
				</div>
				<div class="m-error-wrapper"></div>
			</div>
			<div class="m-psd-wrapper">
				<div class="m-psd">
					<input type="password" name="psd" value="" autocomplete="off" placeholder="Password"/>
					<button class="m-btn m-btn-login" type="button" name="logIn">Log In</button>
				</div>
				<div class="m-error-wrapper"></div>
			</div>
			<button class="m-btn m-btn-register" type="button" name="register">Register</button>
			<div class="m-third-party m-icon-facebook"></div>
			<!-- <div class="m-error-wrapper"></div> -->
		</div>
		<a href="${baseUrl}profile/reset_password" class="m-forgetPsd">
			<#if checkSupportSms()>
				Already using SportyBet via SMS? -
			</#if>
			Forgot Password?
		</a>
	</div>
</#macro>
</#compress>
