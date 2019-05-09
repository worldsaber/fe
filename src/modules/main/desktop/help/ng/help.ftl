<#--  Nigeria help  -->
<div class="m-side-menu">
	<div class="m-menu-group how-to-play">
		<div class="m-menu-group-title"><i class="m-icon-arrow2"></i>How To Play</div>
		<ul class="m-menu-list">
		<li class="m-menu-item" data-to="nav=faq">FAQ</li>
		<li class="m-menu-item" data-to="nav=sports">Sports</li>
		<li class="m-menu-item" data-to="nav=live-betting">Live Betting</li>
		<li class="m-menu-item" data-to="nav=games">Games</li>
		<li class="m-menu-item" data-to="nav=virtuals">Virtuals</li>
		<li class="m-menu-item" data-to="nav=jackpot">Jackpot</li>
		<li class="m-menu-item" data-to="nav=others">Others</li>
		</ul>
	</div>

	<div class="m-menu-group about">
		<div class="m-menu-group-title"><i class="m-icon-arrow2"></i>About</div>
		<ul class="m-menu-list">
		<li class="m-menu-item" data-to="nav=about-us">About Us</li>
		<li class="m-menu-item" data-to="nav=terms-and-conditions">Terms & Conditions</li>
		<li class="m-menu-item" data-to="nav=responsible-gaming">Responsible Gaming</li>
		<li class="m-menu-item" data-to="nav=privacy-policy">Privacy Policy</li>
		</ul>
	</div>
</div>

<div class="m-main-info">
	<div class="m-content faq">
		<#include 'packages/fe-help/ng/pc/how-to-play/faq/index.ftl'>
	</div>

	<div class="m-content sports">
		<#include 'packages/fe-help/ng/pc/how-to-play/sports/index.ftl'>
	</div>

	<div class="m-content live-betting">
		<div class="m-content-wrap">
		<#include 'packages/fe-help/ng/pc/how-to-play/live-betting.ftl'>
		</div>
	</div>

	<div class="m-content games">
		<#include 'packages/fe-help/ng/pc/how-to-play/games/index.ftl'>
	</div>

	<div class="m-content virtuals">
		<#include 'packages/fe-help/ng/pc/how-to-play/virtuals/index.ftl'>
	</div>

	<div class="m-content jackpot">
		<div class="m-content-wrap">
		<#include 'packages/fe-help/ng/pc/how-to-play/jackpot.ftl'>
		</div>
	</div>

	<div class="m-content others">
		<#include 'packages/fe-help/ng/pc/how-to-play/others/index.ftl'>
	</div>

	<div class="m-content about-us">
		<div class="m-content-wrap">
		<#include 'packages/fe-help/ng/pc/about/about-us.ftl'>
		</div>
	</div>

	<div class="m-content terms-and-conditions">
		<#include 'packages/fe-help/ng/pc/about/terms-and-conditions/index.ftl'>
		<div class="m-match-tips">
		<#include 'packages/fe-help/ng/pc/about/terms-and-conditions/_effect-time.ftl'>
		</div>
	</div>

	<div class="m-content responsible-gaming">
		<#include 'packages/fe-help/ng/pc/about/responsible-gaming/index.ftl'>
	</div>

	<div class="m-content privacy-policy">
		<#include 'packages/fe-help/ng/pc/about/privacy-policy/index.ftl'>
	</div>
</div>
