<template>
	<div>
		<div class="top">
			<div class="top-wrapper">
                <div class="banner-content">
					<div class="logo">
						<a :href="home"><img :src="require('./image/logo.png')" alt=""></a>
					</div>
                    <a :href="preFootball"><div class=button></div></a>
                </div>
			</div>
		</div>
		<div class="main-body">
			<div class="gifts-info">
				SportyBet Super Bonus
			</div>
            <div class="terms-conds">
				SportyBet Super Bonus offers a great chance to earn a Bonus of up to 135% on Multiple Bets at SportyBet. This offer applies to returns on all events, all markets of sports and live betting with 4 or more selections with odds 1.2 or higher. The Bonus will not apply where a Stake has been fully cashed out. If a Stake has been partially cashed out, the bonus will be calculated based on the remaining active stake. If your bet wins, the following bonuses will be added to your returns:			</div>
			<div class="bonus-info-table">
				<div class="bets-types">
					<div class="title">
						Bets Types
                        <div class="middleLine"></div>
					</div>
                    <div class="bets-col" v-for="(item,i) in types_1" :key="i">
						<span>{{ item }}</span>
						<span>-Folds</span>
					</div>
				</div>
				<div class="bonus-rate">
					<div class="title">
						Bonus Rate
					</div>
					<div class="bonus-col" v-for="(val,i) in rate_1" :key="i">
                        <!-- <div class="bonus-value"> -->
                            <span>{{val}}</span>
                            <span>%</span>
                        <!-- </div> -->
					</div>
				</div>
                <div class="bets-types">
					<div class="title">
						Bets Types
                        <div class="middleLine"></div>
                    </div>
					<div class="bets-col" v-for="(item,i) in types_2" :key="i">
						<span>{{ item }}</span>
						<span>-Folds</span>
                        <span v-if="item==30">or More</span>
					</div>
				</div>
				<div class="bonus-rate">
					<div class="title">
						Bonus Rate
					</div>
					<div class="bonus-col" v-for="(val,i) in rate_2" :key="i" style="padding-left:8px;">
                            <span>{{val}}</span>
                            <span>%</span>
					</div>
				</div>
			</div>
			<div class="terms-conds" style="margin-top:88px">
                <div class="gifts-info" style="margin-bottom:28px">
                    Terms and Conditions:
                </div>
				<div style="margin-top:-15px;width:861px" v-for="(item,i) in termsAndConds" :key="i">
                    <div style="width:20px;font-weight:bold;color:#353a45">
                        {{ i+1 }}.
                    </div>
                    <div style="position:relative;top:-19px;left:28px;color:#353a45">{{ item }}</div>
                </div>
			</div>
		</div>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';

export default {
	data () {
		return {
			termsAndConds: [
				' SportyBet Super Bonus offers the highest bonus in Kenya! 135%',
				' This offer applies to returns on all events, all markets of sports and live betting with 4 or more selections and odds 1.2 or higher.',
				' The bonus rate is selected based on the number of selections with odds 1.2 or higher. ',
				' Bonus Calculation Formula: stake*total odds*bonus rate. For example: If a player chooses 5-Folds, with 5 odds such as 1.54, 2.3, 1.15, 2.0, 12.0 and the stake is 100, then the bonus will be: 100*(1.54*2.3*1.15*2*12)*5% (in this case, only 4 selections reach the odds requirement, the bonus rate will be calculated based on 4-Folds as the list shown above).',
				' The bonus will not apply if a stake has been fully cashed out. If a stake has been partially cashed out, the bonus will be calculated based on the remaining active stake. ',
				' The bonus part of returns will be added to the customer\'s account after the customer\'s orders are settled. ',
				' In the case of a selection being postponed/void, then the bonus will still apply, but the odds will be calculated as 1.0. For example: If a player chooses 6-Folds, with 6 odds such as 1.54, 2.3, 1.15, 2.0, 12.0, 2.12 and the stake is 100, then the bonus will be: 100*(1.54*2.3*1.15*2*12*2.12)*10%. When the last selection is void, the bonus will be 100*(1.54*2.3*1.15*2*12*1)*5%, the bonus rate also change from 10% to 5% because there are only 4 selections\' odds higher than 1.2 now. ',
				' Where any term of the offer or promotion is breached or there is any evidence of a series of bets placed by a customer or group of customers, which due to a deposit bonus, enhanced payments, free bets, risk free bets or any other promotional offer results in guaranteed customer profits irrespective of the outcome, whether individually or as part of a group, SportyBet reserves the right to reclaim the bonus element of such offers and in their absolute discretion either settle bets at the correct odds, void the free and risk free bets or void any bet funded by the deposit bonus. ',
				' All SportyBet promotions are intended for recreational players and we may in its sole discretion limit the eligibility of customers to participate in all or part of any promotion.',
				' SportyBet reserves the right to amend, cancel, reclaim or refuse any promotion at its own discretion.'
			],
			types_1: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
			rate_1: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
			types_2: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
			rate_2: [70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
			preFootball: pagePath.preFootball,
			home: pagePath.home
		};
	}
};
</script>
<style lang="less">
@import "~base/style/variable.less";

body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.top {
  width: 100%;
}
.top-wrapper {
  height: 462px;
  width: 100%;
  background: url(./image/background.jpg);
  background-size: 100% 462px;
}
.banner-content {
  margin: 0 auto;
  max-width: 1000px;
  height: 517px;
  background: url(./image/sportsman.png);
  background-size: 100% 517px;
  // position: relative;
}
.logo {
  img {
    margin-top: 21px;
    width: 188px;
    height: 36px;
  }
}
.button {
  background: url(./image/button.png);
  width: 309px;
  height: 70px;
  margin-top: 204px;
  margin-left: 410px;
}
.button:hover {
  background: url(./image/buttonActive.png);
}
.main-body {
  width: 877px;
  margin: 0 auto;
}
.bonus-info-table {
  display: flex;
}
.bets-types {
  width: 266px;
  margin-bottom: 8px;
  & > .title {
    width: 208px;
    height: 29px;
    margin-bottom: 8px;
    background-color: #0d9737;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    line-height: 29px;
    color: #ffffff;
  }
}
.middleLine {
  position: relative;
  top: -24px;
  left: 208px;
  width: 0;
  height: 20px;
  border-left: 1px solid #fff;
}
.gifts-info {
  // width: 291px;
  height: 36px;
  position: relative;
  margin-top: 50px;
  left: 50%;
  transform: translate(-50%);
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  color: #353a45;
}
.bonus-rate {
  width: 433px;
  margin-right: 38px;
  & > .title {
    width: 208px;
    height: 29px;
    margin-bottom: 8px;
    background-color: #0d9737;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    line-height: 29px;
    color: #fff;
  }
}
.line {
  border: solid 0.5px #e2e2e2;
  margin-right: -1px;
  margin-bottom: -1px;
}
.bets-col {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 206px;
  height: 29px;
  margin-left: 2px;
  margin-bottom:-1px;
  line-height: 29px;
  font-size: 12px;
  font-weight: 500;
  color: #161616;
  .line;
  border-right: none;

  > span:nth-child(3) {
    margin-left: 5px;
  }
}
.bonus-col {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 206px;
  height: 29px;
  line-height: 29px;
  font-size: 12px;
  font-weight: 500;
  color: #161616;
  .line;
}
.terms-conds {
  width: 877px;
  margin-top: 22px;
  margin-bottom: 58px;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #161616;
}
</style>
