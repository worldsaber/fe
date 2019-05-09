<#compress>
<#include "config/footerConfig.ftl">
<#assign sharedUrl = getSharedUrl()>
<#macro footer_ng>
	<div class="s-footer">
		<div class="m-footer-top">
			<ul class="m-content">
				<li class="m-col-wrapper m-l-left">
					<div class="m-row-top">
						<div class="m-t-mid m-t-light">Register Now!</div>
						<#--  <div class="m-t-mid">SMS "Join"</div>
						<div class="m-t-mid">TO</div>
						<div class="m-t-big">654</div>  -->
					</div>

					<div class="m-row-bottom m-row-fix">
						<div>
							<div class="m-image-wrapper">
								<img src="core/image/lagos.png" alt="lagos">
							</div>
						</div>
					</div>
				</li>

				<li class="m-col-wrapper m-m-r">
					<h6 class="m-col-title">SportyBet Nigeria</h6>
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
						<#--  <li class="m-icon-more"><a href="${baseUrl}help?nav=sms-tutorials">SMS Tutorials</a></li>  -->
						<li class="m-icon-more"><a href="${baseUrl}help?nav=others">Others</a></li>
					</ul>
				</li>

				<li class="m-col-wrapper">
					<h6 class="m-col-title">Contact Us</h6>
					<address class="m-col-content m-contact">
						<div>Telephone: 07008888888</div>
						<div>Email: nigeria.support@SportyBet.com</div>
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
								<img src="core/image/flagNigeria.png" alt="nigeria">
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
					<p class="m-right">SportyBet Nigeria is licensed by the Lagos State Lotteries Board (LSLB) under License No 0000355.</p>
				</li>
			</ul>
		</div>

		<div class="m-footer-bottom">
			<div class="m-content">
				<ul class="m-left">
					<#--  <li class="l-item i-paystake">
						<div class="m-image-wrapper">
							<img src="core/image/paystake.png" alt="">
						</div>
					</li>  -->
					<li class="l-item i-verve">
						<div class="m-image-wrapper">
							<img src="core/image/verve.png" alt="">
						</div>
					</li>
					<li class="l-item i-masterCard">
						<div class="m-image-wrapper">
							<img src="core/image/masterCard.png" alt="">
						</div>
					</li>
					<li class="l-item i-visa">
						<div class="m-image-wrapper">
							<img src="core/image/visa.png" alt="">
						</div>
					</li>
					<li class="l-item i-access">
						<div class="m-image-wrapper">
							<img src="core/image/access.png" alt="">
						</div>
					</li>
					<li class="l-item i-diamond">
						<div class="m-image-wrapper">
							<img src="core/image/diamond.png" alt="">
						</div>
					</li>
					<li class="l-item i-fidelity">
						<div class="m-image-wrapper">
							<img src="core/image/fidelity.png" alt="">
						</div>
					</li>
					<li class="l-item i-gtbank">
						<div class="m-image-wrapper">
							<img src="core/image/gtBank.png" alt="">
						</div>
					</li>
					<li class="l-item i-zenith">
						<div class="m-image-wrapper">
							<img src="core/image/zenith.png" alt="">
						</div>
					</li>
				</ul>
				<span class="m-copy">© ${.now?string('yyyy')} SportyBet. All rights reserved.</span>
			</div>
		</div>
	</div>
</#macro>
</#compress>
