<#compress>
<#include "config/footerConfig.ftl">
<#assign sharedUrl = getSharedUrl()>
<#macro footer_ke>
	<div class="s-footer">
		<div class="m-footer-top">
			<ul class="m-content">
				<li class="m-col-wrapper m-l-left">
					<div class="m-row-top">
						<div class="m-t-small m-t-light">Register Now!</div>
						<div class="m-t-mid">SMS "Join"</div>
						<div class="m-t-mid">TO</div>
						<div class="m-t-big">29123</div>
					</div>

					<div class="m-row-bottom">
						<div>
							<div class="m-image-wrapper">
								<img src="core/image/mpesaIcon@2x.svg" alt="mpesa">
							</div>
							<span class="m-pay">Paybill:</span>
						</div>
						<div class="m-t-big">202202</div>
					</div>
				</li>

				<li class="m-col-wrapper m-m-r">
					<h6 class="m-col-title">SportyBet Kenya</h6>
					<ul class="m-col-content">
						<li class="m-icon-more"><a href="${baseUrl}help?nav=about-us">About Us</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=terms-and-conditions">Terms & Conditions</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=responsible-gaming">Responsible Gambling</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=privacy-policy">Privacy Policy</a></li>
						<li class="m-icon-more"><a href="${baseUrl}partner/index.html">Become a Partner</a></li>
					</ul>
				</li>

				<li class="m-col-wrapper m-m-r">
					<h6 class="m-col-title">How To Play</h6>
					<ul class="m-col-content">
						<li class="m-icon-more"><a href="${baseUrl}help?nav=faq">FAQ</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=sports">Sports</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=live-betting">LiveBetting</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=virtuals">Virtuals</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=jackpot">Jackpot</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=sms-tutorials">SMS Tutorials</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=others">Others</a></li>
					</ul>
				</li>

				<li class="m-col-wrapper">
					<h6 class="m-col-title">Contact Us</h6>
					<address class="m-col-content m-contact">
						<div>Telephone: 0207640825</div>
						<div>Email: kenya.support@sportybet.com</div>
					</address>
				</li>

				<li class="m-col-wrapper m-l-right">
					<address>
						<a href="${sharedUrl.facebook}" target="_blank"><i class="m-icon m-icon-fb"></i></a>
					</address>
					<address>
						<a href="${sharedUrl.twitter}" target="_blank"><i class="m-icon m-icon-twitter"></i></a>
					</address>
					<address style="display:none">
						<a href="${sharedUrl.instagram}" target="_blank"><i class="m-icon m-icon-ins"></i></a>
					</address>
				</li>
			</ul>
		</div>

		<div class="m-footer-mid">
			<ul class="m-content">
				<li class="m-col-wrapper m-l-left">
					<a href="/" class="m-logo-wrapper">
						<i class="m-icon-logo"></i>
						<div class="m-t-center">
							<div class="m-image-wrapper">
								<img src="core/image/flagKenya.png" alt="kenya">
							</div>
						</div>
					</a>
				</li>

				<li class="m-col-wrapper">
					<div class="m-left m-forum">
						<div class="m-image-wrapper">
							<img src="core/image/forum@2x.svg" alt="18+">
						</div>
					</div>
					<p class="m-right">Must be 18 years of age or older to register or play at SportyBet. Gambles may have adverse effects if not made with moderation.</p>
				</li>

				<li class="m-col-wrapper">
					<div class="m-left m-licence">
						<div class="m-image-wrapper">
							<img src="core/image/license@2x.svg" alt="Licence">
						</div>
					</div>
					<p class="m-right">Licence: SportyBet Ltd trading as SportyBet Kenya is licensed by BCLB under the Betting, Lotteries and Gaming Act, Cap 131, Laws of Kenya under License No 683.</p>
				</li>
			</ul>
		</div>

		<div class="m-footer-bottom">
			<div class="m-content">
				<div class="m-left">
					<i class="m-icon m-icon-safari"></i>
					<i class="m-icon m-icon-mpesa"></i>
				</div>
				<span class="m-copy">© ${.now?string('yyyy')} SportyBet. All rights reserved.</span>
			</div>
		</div>
	</div>
</#macro>
</#compress>
