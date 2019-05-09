<template>
  <div class="container">
	  <navbar :backClick="back"></navbar>
	  <noList v-if="!loading&&(!records.length||records.length===0)"></noList>
	  <div class="records" v-else>
		  <div class="record" v-for="(record,i) in records" :key="i" @click="gotoDetail(record.tradeId)">
			  <section :class="{'m-trans-mon':record.monthlyDate}"><div>{{record.monthlyDate}}</div></section>
				<div class="wrapper">
					<div class="cont">
						<div class="m_d">
							<p>{{record.initAmount}}</p>
							<p>{{record.requestTime}}</p>
						</div>
						<div class="s_c">
							<div class="s_c_outter">
							<div class="s_c_inner">
								<p>{{record.statusText}}</p>
								<p>Partner({{record.ptnCode}})</p>
								<p class="pin-code" v-if="record.status===12">[Pin Code: {{record.pin}}]</p>
								<p class="pin-code" v-if="record.status===36">[Cancellation Fee: {{record.cancelFee}}]</p>
							</div>
							</div>
						</div>
					</div>
					<p class="btn" v-if="record.status===10||record.status===12" @click.stop="cancelWithdraw(record.tradeId, record.status)">Cancel Withdraw</p>				
				</div>
		  </div>
		  <div class="nomore" v-if="nomore">- No More Records -</div>
	  </div>
  </div>
</template>

<script>
import navbar from 'components/navbar';
import { pagePath } from 'config/pageConfig.js';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import noList from './nolist';
import { monthData } from '../../js/comFunc';

export default {
	components: {
		navbar,
		noList
	},
	data () {
		return {
			cancelFee: formatNumber(withdrawCfg.withdrawCancelFee, 2),
			records: [],
			flag: {},
			detail: `${pagePath.myCenter}/withdraw/request_list/details`,
			offline: `${pagePath.myCenter}/withdraw?is_offline=1 `,
			lastId: '',
			totalNum: 0,
			hasScroll: false,
			isAjax: false,
			loading: true,
		};
	},
	computed: {
		nomore () {
			return this.records.length > 10 && this.records.length === this.totalNum;
		}
	},
	created () {
		this.getList();
	},
	mounted () {
		document.addEventListener('scroll', e => {
			this.bindBarFixed();
			const wrapper = document.querySelector('.container');
			if (wrapper.scrollHeight - wrapper.scrollTop >= wrapper.clientHeight) {
				this.hasScroll = false;
				this.getMoreList();
			}
		}, false);
	},
	methods: {
		back () {
			location.href = this.offline;
		},
		bindBarFixed () {
			const wrapper = document.querySelector('.container');
			const divs = wrapper.querySelectorAll('.m-trans-mon');
			const len = divs.length;
			for (let i = 0; i < len; i++) {
				if (divs[i].getBoundingClientRect().top <= 0 && (!divs[i + 1] || divs[i + 1].getBoundingClientRect().top) > 0) {
					divs[i].querySelector('div').addClass('m-trans-mon-fixed');
				} else {
					divs[i].querySelector('div').removeClass('m-trans-mon-fixed');
				}
			}
		},
		gotoDetail (tradeId) {
			location.href = `${this.detail}?tradeId=${tradeId}`;
		},
		getList () {
			this.loading = true;
			fetch('pocket/v1/flows', {
				method: 'GET',
				body: {
					pageSize: 10,
					lastId: this.lastId || ''
				}
			})
				.then(res => res.json())
				.then(ret => {
					if (ret.bizCode === 10000) {
						this.hasScroll = true;
						this.isAjax = false;
						this.formateData(ret.data.entityList);
						if (ret.data.entityList.length > 0) {
							this.lastId = ret.data.entityList[ret.data.entityList.length - 1].tradeId;
						}
						this.totalNum = ret.data.totalNum;
						this.loading = false;
					} else {
						this.loading = false;
						this.$dialog.alert('Sorry，something went wrong. Please try again later.');
					}
				})
				.catch(e => {
					this.isAjax = false;
					this.loading = false;
					console.log(e);
					this.$toast('Sorry，something went wrong. Please try again later.');
				});
		},
		getMoreList () {
			if (this.records.length < this.totalNum && !this.isAjax && !this.hasScroll) {
				this.isAjax = true;
				this.getList();
			}
		},
		formateData (data) {
			for (const item of data) {
				item.Month = monthData[new Date(item.requestTime).getMonth()];
				item.Year = new Date(item.requestTime).getFullYear();
				if (!this.flag[`${item.Month} ${item.Year}`]) {
					item.monthlyDate = `${item.Month} ${item.Year}`;
					this.flag[item.monthlyDate] = 1;
				}
				item.requestTime = dateFormat.format(item.requestTime, 'DD/MM HH:mm:ss');
				item.initAmount = formatNumber(item.initAmount / 10000, 2);
				item.cancelFee = formatNumber(item.cancelFee / 10000, 2);
				switch (item.status) {
				case 10:
					item.statusText = 'Waiting for Partner\'s Approval';
					break;
				case 12:
					item.statusText = 'Approved';
					break;
				case 20:
					item.statusText = 'Withdrawal Succeeded';
					break;
				case 30:
					item.statusText = 'Withdrawal Failed';
					break;
				case 35:
					item.statusText = 'Cancelled';
					break;
				case 36:
					item.statusText = 'Cancelled';
					break;
				case 37:
					item.statusText = 'Rejected';
					break;
				case 90:
					item.statusText = 'Request Expired';
					break;
				default:
					item.statusText = 'PIN Code Expired';
					break;
				}
			}
			this.records = [...this.records, ...data];
		},
		cancelWithdraw (tradeId, status) {
			if (status === 10) {
				this.beforeCancel = 'Are you sure you want to cancel the request? Please ensure that Partner has not approved your request or you will be charged a cancellation fee.';
				this.afterCancel = 'Your withdrawal request has been cancelled. A full refund has been returned to your balance.';
			} else if (status === 12) {
				this.beforeCancel = `Since partner has accepted your request, you need to pay cancellation fee ${window.showCurrency} ${this.cancelFee} to the partner for cancelling the request. Are you sure you still want to cancel the request?`;
				this.afterCancel = `Your withdrawal request has been cancelled. Cancellation fee: ${window.showCurrency} ${this.cancelFee} Your withdrawal amount and commision to partner have been returned to your balance.`;
			}
			this.$dialog({
				title: null,
				content: this.beforeCancel,
				button: ['No', 'Yes']
			}).onBtnClick(btnType => {
				if (btnType === 1) {
					fetch(`pocket/v1/bankTrades/bankTrade/${tradeId}/cancel`, {
						method: 'POST'
					})
						.then(res => res.json())
						.then(ret => {
							if (ret.bizCode === 10000) {
								this.$dialog({
									title: null,
									content: this.afterCancel,
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							} else if (ret.bizCode === 11000) {
								this.$dialog({
									title: null,
									content: 'Cancellation failed. Your request status is changed. Please refresh the page to check the latest status.',
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							} else {
								this.$dialog({
									title: null,
									content: ret.message,
									button: ['OK']
								}).onBtnClick(() => {
									location.reload();
								});
							}
						})
						.catch(e => {
							this.$toast('Sorry，something went wrong. Please try again later.');
						});
				}
			});
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.wrapper {
  padding: 0 16 / @rem 19 / @rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid 1/@rem #eaecef;

  .cont {
    display: flex;
    justify-content: space-between;
    .m_d {
      padding-top: 16 / @rem;
      p:first-child {
        font-size: 16 / @rem;
        padding-bottom: 5 / @rem;
      }
      p:last-child {
        color: #9ca0ab;
      }
    }
    .s_c {
      text-align: right;
      padding-top: 16 / @rem;
      p:first-child {
        font-size: 16 / @rem;
        font-weight: 500;
        padding-bottom: 5 / @rem;
      }
      p:nth-child(2) {
        color: #9ca0ab;
      }
    }
  }
  .s_c_inner {
    display: inline-block;
    vertical-align: middle;
  }
  .s_c_outter:after {
    content: ">";
    display: inline-block;
    margin-left: 10 / @rem;
    color: #cececece;
    font-size: 16 / @rem;
  }

  .btn {
    width: 100%;
    margin-top: 18 / @rem;
    border: 1/@rem solid #0d9737;
    height: 37 / @rem;
    line-height: 37 / @rem;
    font-size: 14 / @rem;
    font-weight: 500;
    color: #0d9737;
    text-align: center;
  }

}
  .nomore {
    font-size: 14/@rem;
    text-align: center;
    color: #9ca0ab;
    margin-top: 24 / @rem;
  }
.m-trans-mon {
  height: 36 / @rem;
  &:first-child {
    div {
      box-shadow: 0 1 / @rem 6 / @rem 0 rgba(0, 0, 0, 0.13);
    }
  }
  div {
    background: #dcdee5;
    height: 36 / @rem;
    line-height: 36 / @rem;
    font-size: 14 / @rem;
    font-weight: 500;
    padding-left: 16 / @rem;
  }
  &-fixed {
    position: fixed;
    top: 0;
    width: 100%;
    box-shadow: 0 1 / @rem 6 / @rem 0 rgba(0, 0, 0, 0.13);
    z-index: 10;
  }
}
</style>
