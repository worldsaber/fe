<template>
<div class="lp-container">
	<ActivityReg :class="[planId==3?'lp-reg':'']" :succUrl="succUrl" :topImg="topImg" @regSuccess="succ">
		<div slot="topContent" class="content" v-if="planId==3">
			<h1 class="title">Sport Betting: Discover the best chance of making millions these days</h1>
			<p>Football season is on. This means fans can watch their favorite clubs competing in different leagues. Some football lovers don't just watch matches to see their team to win trophies at the end of the season. For many, it could be lucrative if you have the right knowledge.</p>
			<p>Manchester United fan Steve says he stakes weekly on multiple games, because he knows that he stands a chance of winning big money.</p>
			<p>Steve has made quite some money from placing bets on football games, while betting with moderation. "I decided to accumulate some Premier league games, and went on to check my bet slip the next day. It was like a dream. I was so happy!" Steve talked about his last winning.</p>
		</div>
		<div slot="bottomContent" class="content btm" v-if="planId==3">
			<p>SportyBet has proven itself to be very effective at helping many young football and sport lovers to reward their passion, as the website creates conditions that will help the player enjoy placing bets responsibly in moderation.</p>
		</div>
	</ActivityReg>	
</div>
	
</template>
<script>
import { URL } from 'utils';
import 'components/activityReg';

export default {
	props: ['succUrl', 'topImg'],
	data () {
		return {
			planId: 1,
		};
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');

		this.planId = URL.getPara('planId') || 1;
	},
	methods: {
		succ () {
			this.$emit('regSuccess');
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";

.content {
  padding: 0 26/@rem 22.5/@rem 27/@rem;
  font-family: Roboto;
  font-size: 12/@rem;
  line-height: 1.83;
  text-align: left;
  color: #353a45;
  h1 {
    margin-top: 11/@rem;
    font-size: 18/@rem;
    font-weight: bold;
    text-align: justify;
    line-height: normal;
  }
  p {
	margin: 10/@rem 0;
    font-size: 12/@rem;
    line-height: 1.83;
    text-align: justify;
  }
}
.lp-reg {
  .btn-wrapper,
  .af-button {
    height: 39.5/@rem !important;
  }
  .m-pagelet-index {
    padding: 8/@rem 33/@rem;
    padding-bottom: 15/@rem;
  }
  .m-page-opt {
    padding: 22/@rem 26/@rem !important;
    border-radius: 2/@rem;
    background-color: #f9f9f9;
    border: solid 1/@rem #9b9b9b;
  }
  .btm {
    padding-bottom: 54/@rem;
  }
}
.lp-container .m-pagelet-index .m-page-opt {
  .m-input-wrapper .m-input {
    padding-right: 0 !important;
    font-size: 12/@rem !important;
  }
  .m-input-append > div,
  .m-input-append .send-again {
    width: 100/@rem !important;
    height: 26/@rem;
    line-height: 26/@rem;
  }
  .m-input-append {
    padding-right: 8px !important;
  }
}
</style>
