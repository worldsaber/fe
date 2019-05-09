<#compress>
<#include "config/footerConfig.ftl">
<#assign sharedUrl = getSharedUrl()>
<#macro footer_gh>
	<div class="s-footer s-gh">
		<div class="m-footer-top">
			<ul class="m-content">
				<li class="m-col-wrapper m-l-left">
					<div class="m-row-top">
						<div>
							<!-- <div class="m-image-wrapper">
								<img src="core/image/tiGo1.png" alt="tigo">
							</div> -->
							<span class="m-pay">Paybill:</span>
						</div>
						<div class="m-t-big">*711*222#</div>
					</div>

					<div class="m-row-bottom">
						<div>
							<div class="m-image-wrapper">
								<img src="core/image/gh.png" alt="gh">
							</div>
						</div>
					</div>
				</li>

				<li class="m-col-wrapper m-m-r">
					<h6 class="m-col-title">SportyBet Ghana</h6>
					<ul class="m-col-content">
						<li class="m-icon-more"><a href="${baseUrl}help?nav=about-us">About Us</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=terms-and-conditions">Terms & Conditions</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=responsible-gaming">Responsible Gambling</a></li>
						<li class="m-icon-more"><a href="${baseUrl}help?nav=privacy-policy">Privacy Policy</a></li>
						<li class="m-icon-more" style="display:none"><a href="${baseUrl}partner/index.html">Become a Partner</a></li>
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
						<li class="m-icon-more"><a href="${baseUrl}help?nav=others">Others</a></li>
					</ul>
				</li>

				<li class="m-col-wrapper">
					<h6 class="m-col-title">Contact Us</h6>
					<address class="m-col-content m-contact">
						<#--  <div>Telephone: 0242426200</div>  -->
						<div>Email: ghana.support@sportybet.com</div>
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
						<div class="m-t-pad">
							<div class="m-image-wrapper">
								<img src="core/image/flagGhana.png" alt="ghana">
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
					<p class="m-right">SportyBet Ghana is licensed by the Gaming Commission of Ghana under the Gaming Act, 2006 (Act, 721).</p>
				</li>
			</ul>
		</div>

		<div class="m-footer-bottom">
			<div class="m-content">
				<ul class="m-left">
					<li class="l-item i-tiGo">
						<div class="m-image-wrapper">
							<img src="core/image/tiGo.png" alt="">
						</div>
					</li>
					<li class="l-item i-mtn">
						<div class="m-image-wrapper">
							<img src="core/image/mtn.png" alt="">
						</div>
					</li>
					<li class="l-item i-airtel">
						<div class="m-image-wrapper">
							<img src="core/image/airtel.png" alt="">
						</div>
					</li>
					<li class="l-item i-vodafone">
						<div class="m-image-wrapper">
							<img src="core/image/vodafone.png" alt="">
						</div>
					</li>
				</ul>
				<span class="m-copy">© ${.now?string('yyyy')} SportyBet. All rights reserved.</span>
			</div>
		</div>
	</div>
</#macro>
</#compress>
