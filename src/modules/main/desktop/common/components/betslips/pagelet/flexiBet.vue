<template lang="html">
	<div class="m-flexibet">
		<div class="m-flexi-desc">
			<div class="m-flexi-tips">
				<i class="m-icon-flexibet"></i>
				<div class="m-pop" v-if="!betslipLoading && isInit && showFlexiTips">
					<div class="m-pop-title">
						<i class="m-icon-flexibet"></i>
						<span>Flex Your Bet !</span>
					</div>
					<div class="m-pop-main">{{flexiTips}}</div>
					<i class="m-icon-close" @click="hideFlexiTips"></i>
				</div>
			</div>
			<span>Options to be Correct</span>
			<div class="m-icon--tips">
				<PopOver position="top" :arrowCenter="false" :isCenter="false">
					<p>{{flexiDesc}}</p>
				</PopOver>
			</div>
		</div>

		<div class="m-flexi-help">
			<p v-show="!isMax" v-html="getFlexiHelp"></p>
		</div>

		<template v-if="flexiUnavaliable">
			<div class="m-flexi-switch">
				<span class="m-btn m-btn-sub m-btn--disabled"></span>
				<span class="m-current m-t">{{flexLimit}}</span>
				<span class="m-btn m-btn-add m-btn--disabled"></span>
			</div>

			<div class="m-flexi-note">
				<p class="m-t-tips">{{lockChgTips}}</p>
			</div>
		</template>

		<template v-else>
			<div class="m-flexi-switch">
    			<span :class="[
    				'm-btn',
    				'm-btn-sub',
    				{
    					'm-btn--disabled': isMinDisabled
    				}
    			]" @click="handleChg('sub')"></span>
    			<span :class="[
    				'm-current',
    				'm-t',
    				{
    					'm-t-light': isFlexiAutoChg
    				}
    			]">{{n}}{{isMax ? '' : '+'}}</span>
    			<span :class="[
    				'm-btn',
    				'm-btn-add',
    				{
    					'm-btn--disabled': isMaxDisabled
    				}
    			]" @click="handleChg('add')"></span>
    			<span :class="[
    				'm-max',
    				'm-t',
    				{
    					'm-t-light': isFlexiAutoChg
    				}
    			]" v-if="!isMax">of {{flexiThreshold}}</span>
    		</div>

    		<div class="m-flexi-note">
    			<p class="m-t-err" v-if="errMsg">{{errMsg}}</p>
    			<p class="m-t-tips" v-else-if="isFlexi && !isMax">{{flexiNote}}</p>
    		</div>
		</template>
	</div>
</template>

<script>
import {
	mapGetters,
	mapState,
	mapMutations
} from 'vuex';
import {
	LS
} from 'storage';
import debounce from 'utils/debounce';
import PopOver from 'components/popOver';
import {
	UPDATEFLEXISELECTOR,
	UPDATEMULTIPLEMODE,
	UPDATEFLEXIFLOCKEDSTATUS
} from 'store/betslip/mutationTypes';

import {
	flexiNConfig,
	unlimitNMax
} from 'store/betslip/config';

import {
	flexiTips,
	flexiDesc,
	flexiNote,
	getFlexiMsg,
	errorTips,
	lockChgTips
} from '../js/config';

let debounced = null;

export default {
	components: {
		PopOver
	},
	data() {
		return {
			showFlexiTips: 0,
			flexiTips,
			flexiDesc,
			flexiNote,
			lockChgTips,
			n: 0,
			errMsg: '',
			timerId: null
		};
	},
	computed: {
		...mapState('betslip', [
			'flexiSelect',
			'flexLimit',
			'multipleMode',
			'isFlexiAutoChg',
			'betslipLoading',
			'isInit',
			'flexiSelect',
			'flexiVal'
		]),
		...mapGetters('betslip', [
			'isSimpleMultiple',
			'flexiThreshold',
			'isFlexi',
			'canShowFlexitips'
		]),
		isUnderMin() {
			return this.flexiThreshold <= unlimitNMax && this.n <= this.flexLimit ||
				this.flexiThreshold > unlimitNMax && this.n <= flexiNConfig[this.flexiThreshold];
		},
		isMinDisabled() {
			return !this.isSimpleMultiple || this.isUnderMin;
		},
		isMax() {
			return this.n === this.flexiThreshold;
		},
		isMaxDisabled() {
			return !this.isSimpleMultiple || this.isMax;
		},
		getFlexiHelp() {
			return getFlexiMsg(this.flexiThreshold, this.n);
		},
		flexiUnavaliable() {
			return this.multipleMode === 1 && this.flexiThreshold <= this.flexLimit;
		}
	},
	watch: {
		flexiVal(val) {
			let flexiTipsStatus = LS.get('pc_flexibet');
			flexiTipsStatus = flexiTipsStatus ? +flexiTipsStatus : 1;

			this.showFlexiTips = flexiTipsStatus;
		},
		isSimpleMultiple(val) {
			if (!val) {
				this.updateMultipleMode(1);
			}
		},
		multipleMode(val, oldVal) {
			if (val === 1) {
				const N = this.flexiThreshold;
				this.n = N;
				this.updateFlexiSelector(N);
			}
		},
		flexiThreshold(val, oldVal) {
			if (this.multipleMode === 1) {
				this.n = val;
				this.updateFlexiSelector(val);
				return;
			}

			if (val === this.flexLimit) {
				this.updateMultipleMode(1);
				return;
			}

			const diff = oldVal - val,
				temp = this.n - diff;

			let n;

			// 串关数量减少时，同步更新n
			if (diff > 0) {
				if (val <= unlimitNMax && temp >= this.flexLimit) {
					this.n = temp;
					n = temp;
				}

				if (val > unlimitNMax) {
					this.n = temp >= flexiNConfig[val] ? temp : flexiNConfig[val];
					n = this.n;
				}
			} else if (diff < 0) {
				this.n = val > unlimitNMax ? temp > flexiNConfig[val] ? temp : flexiNConfig[val] : temp;
				n = this.n;
			}

			n && this.updateFlexiSelector(n);

			if (n === val && val <= this.flexLimit) {
				this.updateMultipleMode(1);
			}

			this.updateFlexiLockedStatus(false);
		},
		errMsg(val) {
			this.timerId && clearTimeout(this.timerId);

			if (val) {
				this.timerId = setTimeout(() => {
					this.errMsg = '';
				}, 2000);
			}
		},
		canShowFlexitips(val) {
			if (val && !this.showFlexiTips) {
				let flexiTipsStatus = LS.get('pc_flexibet');
				flexiTipsStatus = flexiTipsStatus ? +flexiTipsStatus : 1;
				this.showFlexiTips = flexiTipsStatus;
			}
		}
	},
	methods: {
		...mapMutations('betslip', {
			updateFlexiSelector: UPDATEFLEXISELECTOR,
			updateFlexiLockedStatus: UPDATEFLEXIFLOCKEDSTATUS,
			updateMultipleMode: UPDATEMULTIPLEMODE
		}),
		hideFlexiTips() {
			this.showFlexiTips = 0;
			LS.set('pc_flexibet', 0);
		},
		handleChg(type) {
			if (debounced) {
				debounced.cancel();
			}

			if (this.errMsg) {
				this.errMsg = '';
			}

			if (!this.isSimpleMultiple) {
				this.$nextTick(() => {
					this.errMsg = errorTips.noSimple;
				});
				return;
			}

			if (this.isUnderMin && type === 'sub' || this.isMax && type === 'add') {
				this.$nextTick(() => {
					this.errMsg = errorTips.disabled;
				});
				if (this.n !== this.flexiSelect) {
					this.updateFlexiSelector(this.n);
				}
				return;
			}

			switch (type) {
			case 'sub':
				if (this.n !== this.flexLimit) {
					--this.n;
				}
				break;
			case 'add':
				if (this.n !== this.flexiThreshold) {
					++this.n;
				}
				break;
			default:
			}

			debounced = debounce(() => {
				if (this.n === this.flexiThreshold) {
					this.updateMultipleMode(1);
				} else {
					this.updateMultipleMode(2);
				}
				this.updateFlexiSelector(this.n);
			}, 320);
			debounced();
		}
	},
	created() {
		this.n = this.flexiThreshold;

		let flexiTipsStatus = LS.get('pc_flexibet');
		flexiTipsStatus = flexiTipsStatus ? +flexiTipsStatus : 1;
		this.showFlexiTips = flexiTipsStatus;

		window.addEventListener('unload', () => {
			this.showFlexiTips && LS.set('pc_flexibet', 0);
		});
	}
};
</script>

<style lang="less">
@import '../style/flexibet.less';
</style>
