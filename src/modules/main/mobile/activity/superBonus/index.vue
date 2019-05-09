<template>
<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div slot="mid">
	<div style="overflow: hidden;">
		<div class="top">
			<div class="top-wrapper">
				<div class="logo">
					<a :href="home"><img :src="require('./image/logo.png')" alt=""></a>
				</div>
				<div class="button" @click="bettingHandler()"></div>
			</div>
		</div>
		<div class="main-body">
			<div class="terms-conds">
				<div class="terms-conds-title">SportyBet Super Bonus</div>
				<div class="splitter"></div>
				<div class="terms-conds-content">
					SportyBet Super Bonus offers a great chance to earn a Bonus of up to 135%
					on Multiple Bets at SportyBet. This offer applies to returns on all events,
					 all markets of sports and live betting with 4 or more selections with odds
					 1.2 or higher. The Bonus will not apply where a Stake has been fully cashed out.
					 If a Stake has been partially cashed out, the bonus will be calculated based
					 on the remaining active stake. If your bet wins, the following bonuses will be added to your returns:
				</div>
			</div>
			<div class="bonus-info-table">
				<div class="bonus-table-wrapper">
					<div class="bets-types">
						<div class="title">
							Bets Types
							<div class="middle-line"></div>
						</div>
						<div class="bets-wrapper bets-toggle">
							<div class="bets-col" v-for="(item,i) in types_1" :key="i">
								<span>{{ item }}</span><span>-Folds</span><span v-if="item==30">or above</span>
							</div>
						</div>
				</div>
				<div class="bonus-rate" >
					<div class="title">
						Bonus Rate
					</div>
					<div class="bonus-wrapper bonus-toggle">
						<div class="bonus-col" v-for="(val,i) in rate_1" :key="i">
							<div class="bonus-value">
								<span>{{val}}</span>
								<span>%</span>
							</div>
						</div>
					</div>
				</div>
				</div>
				<div class="unfold" @click=showRest() v-show="unShow">See All</div>
			</div>
			<div class="rules-wrapper">
                <div class="gifts-info">
                    Terms and Conditions:
                </div>
				<div class="splitter"></div>
				<div class="rules" v-for="(item,i) in termsAndConds" :key="i">
                    <div class="rule-index">
                        {{ i+1 }}.
                    </div>
                    <div class="rule">{{ item }}</div>
                </div>
			</div>
			<div class="betting">
				<div class="betting-desc">
					The highest return in all Kenya! Bonuses create more wealth! Have a try!
				</div>
				<button class="betting-btn" @click="bettingHandler()">Bet Now</button>
			</div>
		</div>
	</div>
	</div>
	</Layout>
</template>
<script>
import 'components/dialog';
import 'packages/button';
import 'appCore';
import 'kernel/js/dateFormat';
import Layout from 'components/layout/main.vue';
import { pagePath } from 'config/pageConfig';
import { jmpPrematchList } from 'config/appPagePath';

export default {
	data () {
		return {
			preFootball: pagePath.preFootball,
			home: pagePath.home,
			unShow: true,
			activityStatus: 0,
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
			types_1: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
			rate_1: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135]
		};
	},
	components: {
		Layout
	},
	methods: {
		showRest () {
			const bets = document.querySelector('.bets-toggle');
			const betsClasses = bets.getAttribute('class');
			bets.setAttribute('class', betsClasses.replace('bets-toggle', ''));
			const bonus = document.querySelector('.bonus-toggle');
			const bonusClasses = bonus.getAttribute('class');
			bonus.setAttribute('class', bonusClasses.replace('bonus-toggle', ''));
			this.unShow = false;
		},
		bettingHandler () {
			if (this.activityStatus === 90) {
				this.openDialog(
					'Notice',
					'<div>This promotion is over,</div><div>remember to come earlier next </div><div>time!</div>'
				);
			} else {
				if (window.AppCore.getAppName() === 'sportybet') {
					return window.AppCore.sendCmd(jmpPrematchList('sr:sport:1'));
				}
				window.location.href = pagePath.preFootball;
			}
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.m-page-loading-wrap {
  display: none;
}
.m-top-wrapper {
  display: none;
}
.top {
  width: 100%;
  height: 288/@rem;
  text-align: center;
}
.top-wrapper {
  height: 288/@rem;
  background: url(./image/background.jpg);
  background-size: 100% 288/@rem;
  position: relative;
}
.logo {
  position: absolute;
  top: 11/@rem;
  left: 22/@rem;
  img {
    width: 100/@rem;
    height: 20/@rem;
  }
}
.button {
  background: url(./image/button.png);
  background-size: 145/@rem 45/@rem;
  width: 145/@rem;
  height: 45/@rem;
  position: relative;
  top: 190/@rem;
  left: 132/@rem;
}
.button:hover {
  background: url(./image/buttonActive.png);
  background-size: 145/@rem 45/@rem;
}
.main-body {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.gifts-info {
  margin-top: 36/@rem;
  font-size: 20/@rem;
  font-weight: bold;
  text-align: center;
  color: #353a45;
}
.terms-conds {
  width: 277/@rem;
  height: 192/@rem;
  margin: 27/@rem auto 0;
  font-size: 12/@rem;
  font-weight: 500;
  line-height: 1.33;
  text-align: center;
}
.terms-conds-title {
  margin-top: 35/@rem;
  font-size: 20/@rem;
  font-weight: bold;
  line-height: 1;
  color: #353a45;
}
.terms-conds-content {
  width: 277/@rem;
  height: 192/@rem;
  text-align: left;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #161616;
}

.splitter {
  width: 274/@rem;
  border-bottom: 1/@rem solid #f2f3f5;
  margin: 7/@rem 0 17/@rem 0;
}
.middle-line {
  position: relative;
  z-index: 2;
  top: -24/@rem;
  left: 131/@rem;
  width: 0;
  height: 20/@rem;
  border-left: 1/@rem solid #fff;
  opacity: 0.5;
}
.bets-types {
  width: 130/@rem;
  // margin-bottom: 8/@rem;
  & > .title {
    // width: 130/@rem;
    height: 29/@rem;
    margin-bottom: 8/@rem;
    background-color: #0d9737;
    font-size: 16/@rem;
    font-weight: 500;
    text-align: center;
    line-height: 29/@rem;
    color: #ffffff;
  }
}
.bets-col {
  // width: 130/@rem;
  height: 29/@rem;
  // margin-left: 2/@rem;
  line-height: 29/@rem;
  font-size: 12/@rem;
  font-weight: 500;
  color: #161616;
  border-right: none;

  > span:nth-child(3) {
    margin-left: 5/@rem;
  }
}
.bets-col:nth-of-type(odd) {
  background: #f6f6f6;
}
.bets-toggle > div:nth-child(n + 12) {
  display: none;
}
.bonus-info-table {
  width: 268/@rem;
  // height:1620/@rem;
  margin: 23/@rem auto 0 auto;
  .bonus-table-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    > div {
      flex: 1;
      max-width: 50%;
    }
  }
}
.bonus-rate {
  width: 129/@rem;
  // position: relative;
  // left: 130/@rem;
  // top: -828/@rem;
  & > .title {
    // width: 129/@rem;
    height: 29/@rem;
    margin-bottom: 8/@rem;
    background-color: #0d9737;
    font-size: 16/@rem;
    font-weight: 500;
    text-align: center;
    line-height: 29/@rem;
    color: #ffffff;
  }
}
.bonus-col:nth-of-type(odd) {
  background: #f6f6f6;
}
.bonus-col {
  width: 129/@rem;
  height: 29/@rem;
  // margin-top:-1/@rem;
  line-height: 30/@rem;
  font-size: 12/@rem;
  font-weight: 500;
  color: #161616;
}
.bonus-toggle > div:nth-child(n + 12) {
  display: none;
}
.unfold {
  width: 262/@rem;
  height: 28/@rem;
  line-height: 28/@rem;
  margin: 12/@rem auto 0;
  border: 1px solid #0d9737;
  border-radius: 2/@rem;
  color: #0d9737;
}
.rules-wrapper {
  width: 260/@rem;
  margin: 0 auto 30/@rem;
  text-align: center;
  .rules {
    width: 240/@rem;
    text-align: left;
    color: #353a45;
    .rule-index {
      font-weight: bold;
    }
    .rule {
      position: relative;
      left: 18/@rem;
      top: -16/@rem;
      margin-bottom: -16/@rem;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
    }
  }
}
.betting {
  box-sizing: border-box;
  width: 100%;
  height: 154/@rem;
  background-color: #f9f9f9;
  padding: 16/@rem 0 33/@rem;
  text-align: center;
  .betting-desc {
    margin: 0 auto;
    width: 233/@rem;
    height: 36/@rem;
    font-size: 12/@rem;
    font-weight: 500;
    line-height: 1.5;
    color: #353a45;
    margin-bottom: 21/@rem;
  }
  button {
    margin: 0 auto;
    width: 230/@rem;
    height: 48/@rem;
    color: #184b19;
    font-size: 16/@rem;
    font-weight: bold;
    background-color: #0d9737;
    border: 0;
    border-radius: 2/@rem;
    outline: 0;
    &:hover {
      color: #20a0ff;
      border-color: #20a0ff;
    }
  }
}
</style>
