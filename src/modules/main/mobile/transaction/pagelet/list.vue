<template>
  <div>
	<topNavBar :backClick="back">
      	<div slot="right" class="m-nav-right-box">
        <AfSelect
			:readonly="true"
			:data='typeList'
          	:ListWidth="clientWidth"
			v-model="type"/>
		<template v-if="!isHistory">
			<i class="icon-search" @click="goSearch"/>
        	<a :href="`${helpUrl}#/how-to-play/others/how-to-view-transactions-and-bet-history`"><i class="m-icon--question"></i></a>
     	</template>
	  </div>
    </topNavBar>
		<withdrawTip ref="withdrawTip"/>
		<withdrawTip class="m-trans-fixed" ref="fixedWithdrawTip"/>
		<div v-loading:fetchData="loading">
			<template v-if="!loading">
				<noList v-if="dataList.length === 0" @goHistory="goHistory" :isHistory="isHistory"/>
				<template v-else>
					<a class="to-manual" :href="manualCheck" v-if="country==='ke' || country === 'gh'">Was your Deposit unsuccessful？</a>
					<ul class="m-trans-list">
						<template v-for="(item, index) in dataList" >
							<li class="m-trans-mon" v-if="!!item.showMothYear" :key="`year-${index}`">
									<div>{{item.showMothYear}}</div>
								</li>
								<li :key="index" @click="showDetail(item)">
									<div class="m-trans-r1">
										<em>{{item.type}}</em>
										<i>{{['','+','-'][item.amountSign]}} {{item.amountStr}}</i>
									</div>
									<div class="m-trans-r2">
										<em>{{item.showDate}} {{item.showTime}}</em>
										<i :class="{'m-txt-red':item.status === 10}" v-if="item.status != 20">{{item.statusStr}}</i>
									</div>
								</li>
						</template>
					</ul>
					<div class="m-list-nomore" v-if="showNoMoreRecord && isHistory">No More Records</div>
					<div class="m-list-nomore-wrap" v-if="showNoMoreRecord && !isHistory">
						<div class="m-list-history-nomore">Show only histories in last 6 months</div>
						<div class="m-list-gohistory" @click="goHistory">View older histories ></div>
					</div>
				</template>
			</template>
		</div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import AfSelect from 'packages/select';
import topNavBar from 'components/navbar';
import withdrawTip from 'components/withdrawBlockTip';
import { pagePath } from 'config/pageConfig';
import { getTypeWithSub } from 'transaction/tool';
import noList from './nolist';
import { monthObj, typeList, statusMap, pendingMap } from '../config';
import '../../mockData/transaction/index?debug';

export default {
	components: {
		topNavBar,
		AfSelect,
		noList,
		withdrawTip
	},
	data () {
		return {
			typeList,
			pageSize: 20,
			lastId: '',  // 上一条记录id,
			dataList: [],
			loading: false,
			clientWidth: document.documentElement.clientWidth,
			type: { name: 'All Categories', value: '0' },
			totalNum: 0,
			hasScroll: false,
			isAjax: false, // 是否正在加载数据
			home: pagePath.home,
			helpUrl: pagePath.help,
			manualCheck: pagePath.manualCheck,
			country: window.country || '',
			isHistory: false,
			limit: 0 // 日期滚动置顶区域坐标，没有有withdrawTip时为0
		};
	},
	computed: {
		...mapState('assetsInfo', ['auditStatus']),
		showNoMoreRecord () {
			const len = this.dataList.length || 0;
			return len && len >= this.totalNum;
		}
	},
	watch: {
		type () {
			this.hasScroll = false;
			this.lastId = '';
			this.dataList = [];
			this.fetchData();
		}
	},
	created () {
		this.fetchData();
	},
	mounted () {
		const wrapper = document.querySelector('.m-main-mid');
		wrapper.addEventListener('scroll', e => {
			this.bindBarFixed();
			if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
				this.hasScroll = true;
				this.getMoreList();
			}
		}, false);
	},
	methods: {
		back() {
			if (this.isHistory) {
				this.isHistory = false;
				this.hasScroll = false;
				this.lastId = '';
				this.dataList = [];
				this.fetchData();
			} else {
				window.history.go(-1);
			}
		},
		bindBarFixed () {
			const wrapper = document.querySelector('.m-main-mid');
			const divs = wrapper.querySelectorAll('.m-trans-mon');
			const len = divs.length;
			const withdrawTipEle = this.$refs.withdrawTip.$el;
			if ([11, 12, 13].indexOf(this.auditStatus) > -1) {
				this.limit = withdrawTipEle.getBoundingClientRect().height || 0;
				const fixedWithdrawTipEle = this.$refs.fixedWithdrawTip.$el;
				if (withdrawTipEle.getBoundingClientRect().top <= 0) {
					fixedWithdrawTipEle.style.display = 'flex';
				} else {
					fixedWithdrawTipEle.style.display = 'none';
				}
			}
			for (let i = 0; i < len; i++) {
				const ele = divs[i].querySelector('div');
				if (divs[i].getBoundingClientRect().top <= this.limit && (!divs[i + 1] || divs[i + 1].getBoundingClientRect().top > this.limit)) {
					ele.addClass('m-trans-mon-fixed');
					ele.style.top = `${this.limit}px`;
				} else {
					ele.removeClass('m-trans-mon-fixed');
					ele.style.top = '';
				}
			}
		},
		fetchData () {
			this.loading = true;
			this.getList().then(() => {
				this.loading = false;
			}, () => {
				this.loading = -1;
			}).catch(() => {
				this.loading = -1;
			});
		},
		getMoreList () {
			if (this.dataList.length < this.totalNum && !this.isAjax && !this.loading) {
				this.isAjax = true;
				this.getList().then(() => {
					this.isAjax = false;
				}).catch(() => {
					this.isAjax = false;
				});
			}
		},
		getList () {
			return new Promise((resolve, reject) => {
				// console.log('type:' + this.type.value + '; lastId:' + this.lastId);
				fetch('/pocket/v1/statements', {
					method: 'GET',
					body: {
						type: this.type.value,
						pageSize: this.pageSize,
						lastId: this.lastId,
						isHistory: this.isHistory ? 1 : 0
					}
				}).then(res => res.json())
				.then(data => {
					const code = data.bizCode;
					if (code === 10000) {
						this.formatDataList(data.data);
						resolve(true);
					} else {
						reject(false);
					}
				}).catch(err => {
					console.error(err); // eslint-disable-line
					reject(false);
				});
			});
		},
		// 格式化部分数据
		formatDataList (data) {
			let list = data.statements || [];
			let len = list.length;
			const index = this.dataList.length;
			if (!this.lastId) {
				this.totalNum = data.totalNum;
				this.dataList = list;
			} else {
				this.dataList = [...this.dataList, ...list];
			}
			this.lastId = list[len - 1] ? list[len - 1].tradeId : '';
			// 列表总数只有第一次获取才有，后面给的值是0
			list = this.dataList;
			len = list.length;
			if (len) {
				for (let i = index; i < len; i++) {
					const createTime = list[i].createTime;
					list[i].showDate = dateFormat.format(createTime, 'DD/MM');
					list[i].month = dateFormat.format(createTime, 'MM');
					list[i].showTime = dateFormat.format(createTime, 'HH:mm:ss');

					list[i].isShowMonth = (i === 0 || dateFormat.format(list[i - 1].createTime, 'MM') !== list[i].month);
					if (list[i].isShowMonth) {
						list[i].showMothYear = monthObj[Number(list[i].month) - 1] + ' ' + dateFormat.format(createTime, 'YYYY');
					}
					list[i].type = this.getType(list[i]);
					// 如果是取现则显示 总金额 - 手续费
					if (list[i].tradeCode === 'WD0001' || list[i].tradeCode === 'WD0004') {
						list[i].amountStr = formatNumber((list[i].amount - list[i].feeAmount) / 10000, 2) || '';
						list[i].feeStr = formatNumber(list[i].feeAmount / 10000, 2);
					} else {
						list[i].amountStr = formatNumber(list[i].amount / 10000, 2) || '';
					}
					list[i].statusStr = statusMap[list[i].status] || '';
					if (list[i].status === 10 && list[i].auditStatus) {
						list[i].statusStr = pendingMap[list[i].auditStatus] || list[i].statusStr;
					}
					list[i].afterBalStr = '- - -';
					// 线下派奖balance显示 - - -
					if (list[i].tradeCode === 'CB0003') {
						list[i].afterBalStr = '- - -';
					} else if (list[i].status !== 10 && list[i].afterBal !== undefined) {
						list[i].afterBalStr = formatNumber(list[i].afterBal / 10000, 2);
					}
				}
			}
		},
		getType (obj) {
			return getTypeWithSub(obj);
		},
		showDetail (obj) {
			// obj.showCurrency = this.showCurrency;
			obj.fee = this.fee;
			this.$emit('changeDetailEvent', obj, this.isHistory);
		},
		goSearch() {
			this.$emit('toggleSearch');
		},
		goHistory() {
			this.isHistory = true;
			this.hasScroll = false;
			this.lastId = '';
			this.dataList = [];
			this.fetchData();
		}
	}
};
</script>
<style lang="less">
@import '../index.less';
</style>
