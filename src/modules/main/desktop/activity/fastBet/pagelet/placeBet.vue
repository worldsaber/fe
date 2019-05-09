<template>
<div :class="['container', {
		'off': !pageReady
	}]" >
	<div class="err-img" v-if="showImg">
		<a :href="path"><img src="../image/errImg.jpg"></a>
	</div>
	<div class="place-bet-wrapper" v-if="showImg===false">
		<div class="info">GET {{showCurrency}}50 FREE BET!</div>
		<div class="game-info-wrapper">
			<div class="tournament-info">
				<span class="tournament">{{categoryName}} - {{tournamentName}}</span>
				<span class="date">{{date}}</span><span class="time">{{time}}</span>
			</div>
			<table class="team-table">
				<tr class="up">
					<td class="team">Home Team:</td>
					<td class="team-name">{{homeTeamName}}</td>
				</tr>
				<tr class="down">
					<td class="team">Away Team:</td>
					<td class="team-name">{{awayTeamName}}</td>
				</tr>
			</table>
			<div class="markets-wrapper">
				<div class="markets" v-for="(odds,index) in oddses" :key="index" @click="selectOdds,trackOdds(index)">
					<button class="market" :class="[odds == currentOdds? 'active':'']">
						<div class="outcome" v-if="index===0">1</div>
						<div class="outcome" v-if="index===1">X</div>
						<div class="outcome" v-if="index===2">2</div>
						<span style="display:inline-block;margin-top:-5px;font-size:18px;">{{odds}}</span>
					</button>
				</div>
			</div>
		</div>
		<div class="button-area">
			<button @click="gotoRegister">Place FreeBet</button>
		</div>
	</div>
</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat';
import { LS } from 'storage';
import { wapBaseUrl, domain, protocol, pagePath } from 'config/pageConfig';
import { showCurrency } from 'config/currencyConfig';
import 'utils/dom';
import '../../../mockData/fastBet/fastBet?debug';

export default {
	created () {
		const loadingDom = document.querySelector('#app') || null;
		fetch('factsCenter/fastBetEvent', {
			method: 'GET',
			body: {
				count: 1,
			}
		})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const event = res.data[0].events[0];
					const market = event.markets[0];
					const category = event.sport.category;
					if (market.status === 0) {
						this.tournamentName = category.tournament.name;
						this.categoryName = category.name;
						this.homeTeamName = event.homeTeamName;
						this.awayTeamName = event.awayTeamName;
						this.date = dateFormat.format(event.estimateStartTime, 'MM/DD');
						this.time = dateFormat.format(event.estimateStartTime, 'HH:mm');
						LS.set('eventId', event.eventId);
						this.marketsId = market.id;
						const outcomes = market.outcomes;
						for (let i = 0; i < 3; i++) {
							const odds = +outcomes[i].odds;
							// 保存赔率
							this.oddses.push(odds.toFixed(2));
							// 保存赔率对应的ID
							this.outcomesId[odds] = outcomes[i].id;
						}
						// 取出当前最大的赔率
						this.currentOdds = Math.max.apply(null, this.oddses);
						this.$emit('reqDone', false);
					} else {
						this.showImg = true;
						this.$emit('reqDone', true);
					}
				} else {
					this.showImg = true;
					this.$emit('reqDone', true);
				}
				this.pageReady = true;
				loadingDom && (loadingDom.style.display = 'none');
			})
			.catch(res => {
				this.showImg = true;
				this.pageReady = true;
				loadingDom && (loadingDom.style.display = 'none');
				this.$emit('reqDone', true);
			});
	},
	mounted () {
		const isWap = new RegExp(wapBaseUrl).test(window.location.href);
		// if (window.location.href.split('/')[4] === 'm') {
		// 	this.path = location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/m/';
		// } else {
		// 	this.path = location.protocol + '//' + location.hostname + '/' + location.pathname.split('/')[1] + '/';
		// }
		if (isWap) {
			this.path = `${protocol}//${domain}${pagePath.wapHome}`;
		} else {
			this.path = `${protocol}//${domain}${pagePath.home}`;
		}
		console.log('path:' + this.path);
	},
	data () {
		return {
			path: '',
			showImg: false,
			tournamentName: '',
			categoryName: '',
			date: '',
			time: '',
			homeTeamName: '',
			awayTeamName: '',
			oddses: [],
			currentOdds: 0,
			potentialWin: 0,
			isActive: false,
			isLargest: false,
			marketsId: '',
			outcomesId: {},
			eventId: '',
			id: '',
			showCurrency,
			pageReady: false
		};
	},
	methods: {
		// 改变选中赔率的样式
		selectOdds (e) {
			document.querySelectorAll('.market').removeClass('active');
			e.target.closest('.market').addClass('active');
		},
		// 获取当前选中的赔率
		trackOdds (index) {
			this.currentOdds = this.oddses[index];
		},
		// 保存下单接口需要的数据，跳转到注册页
		gotoRegister () {
			LS.set('odds', this.currentOdds + '');
			this.id = 'uof:3/sr:sport:1/' + this.marketsId + '/' + this.outcomesId[this.currentOdds + ''];
			LS.set('id', this.id);
			this.$emit('goRegister');
		},
	}
};
</script>

<style lang="less">
.container{
	white-space: nowrap;

	&.off {
		display: none;
	}

}
.err-img{
	position:relative;
	top: 0;
}
.place-bet-wrapper {
  height: 160px;
  color: #fff;
  .game-info-wrapper {
    background: #363a45;
    padding-bottom: 20px;
  }
  .tournament-info {
    padding: 20px 0 13px;
    .tournament {
      margin: 0 62px 0 20px;
    }
    .date {
      margin-right: 10px;
    }
    .teams {
      display: table-cell;
    }
  }
  .markets-wrapper {
    margin-top: 12px;
    margin-left: 17px;
  }
  .markets {
    height: 100%;
    display: inline-table;
    border-collapse: separate;
    .market {
      display: table-cell;
      vertical-align: middle;
      color: white;
      width: 94px;
      height: 40px;
      margin-left: 1px;
      border: none;
      outline: none;
      border-radius: 2px;
      background-image: linear-gradient(to bottom, #0a9737, #006a22);
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3);
    }
  }
}
.active {
  background: #30ea6a !important;
  color: #1c1e26 !important;
}
.team-table {
  width: 100%;
  .team {
    padding-left: 20px;
  }
  .team-name {
    float: right;
    padding-right: 20px;
    font-family: Roboto;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0.2px;
    text-align: right;
  }
}
.button-area {
  height: 84px;
  line-height: 84px;
  background: #1c1e26;
  text-align: center;
  button {
    width: 160px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 20px;
    background-image: linear-gradient(to bottom, #17ce1d, #16b31a);
    box-shadow: 0 2px 5px 0 rgba(50, 206, 98, 0.5);
    color: #fff;
	font-size: 16px;
	font-weight: bold;
  }
}
</style>
