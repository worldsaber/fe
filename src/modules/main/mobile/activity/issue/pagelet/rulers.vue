<style lang="less">

@import '../style/rulers.less';

</style>

<template lang="html">

<div class="m-rulers">
    <template v-if="showTimer">
        <p class="m-title">READY TO CHALLENGE YOURSELF!</p>
        <div class="m-timer">{{showTimer}}</div>
    </template>

    <div v-else>
		<transition-group enter-active-class="fadeIn" leave-active-class="fadeOut" tag="ul">
			<li
				class="m-main"
				v-for="(item, index) in composedRulers"
				:key="index"
				v-if="isCurrent(index)"
			>
				<div class="m-image-wrapper">
					<img :src="item.img" alt="">
				</div>
				<p class="m-text">{{item.text}}</p>
			</li>
		</transition-group>

        <div class="m-time">
            <div class="m-hour">
                <div class="m-label">Min.</div>
                <div class="m-value">{{indexTime.minute||'0'}}</div>
            </div>
            <div class="m-sec">
                <div class="m-label">Sec.</div>
                <div class="m-value">{{indexTime.second||'0'}}</div>
            </div>
        </div>
    </div>

</div>

</template>

<script>
import {
    mapState,
    mapMutations,
	mapActions
} from 'vuex';
import {
    UPDATE_PAGE_MODULE
} from 'store/issue/mutationTypes';

import {
    rulers
} from '../js/config';
import {
	formatTime,
	getAdvertInArray
} from '../js/commonFun';

const TIMER_CONDITION = 5 * 1000;

export default {
	data() {
		return {
			currentIndex: 0,
			showTimer: 0,
			timerId: null,
			rulers,
			indexTime: {}
		};
	},

	computed: {
		...mapState('issue', [
			'baseInfo',
			'deltaTime',
			'adConfig'
		]),
		rulersCount() {
			return this.rulers.length;
		},
		startTime() {
			const baseInfo = this.baseInfo || {};

			return baseInfo.startTime + this.deltaTime;
		},
		quizShowRule() {
			// test data
			// return [{
			// 	text: 'gift-dialog',
			// 	img: require('../image/gift-dialog.png')
			// }];

			const ruleAdvert = this.adConfig.quizShowRule || {};
			const ruleAdverts = getAdvertInArray(ruleAdvert);

			return ruleAdverts.map(advert => ({
				text: advert.text,
				img: advert.imgUrl,
			}));
		},
		composedRulers() {
			return [...this.quizShowRule, ...this.rulers];
		}
	},

	watch: {
		showTimer(val, oldval) {
			if (val === 0) {
				this.$router.replace({ name: 'issue' });
			}
		}
	},
	methods: {
		...mapActions('issue', [
			'getParticipantsCount'
		]),
		...mapMutations('issue', {
			chgShowPage: UPDATE_PAGE_MODULE
		}),
		isCurrent(index) {
			const currentIndex = this.currentIndex;

			return index === currentIndex;
		},
		timer() {
			const startTime = this.startTime;
			let count = 0,
				now,
				dis;

			this.timerId = setInterval(() => {
				now = Date.now();
				dis = startTime - now;

				if (dis <= 0) {
					clearInterval(this.timerId);
					this.showTimer = 0;
					return;
				}

				++count;

				if (dis <= TIMER_CONDITION) {
					if (count % 10 === 0) {
						this.showTimer = Math.floor(dis / 1000);
					}
				} else {
					if (count % 60 === 0) {
						++this.currentIndex;
						this.currentIndex %= this.rulersCount;
					}

					if (count % 10 === 0) {
						this.indexTime = formatTime(dis);
					}

					// 5秒直接开始倒计时
					if (this.indexTime.minute === 0 && this.indexTime.second === 5) {
						this.showTimer = 5;
					}
				}
			}, 100);
		}
	},
	mounted() {
		const now = Date.now();
		const startTime = this.startTime,
			dis = startTime - now;

		if (dis > TIMER_CONDITION) {
			this.indexTime = formatTime(dis);
		} else {
			this.showTimer = Math.floor(dis / 1000);
			!this.showTimer && this.$router.replace({ name: 'issue' });
		}

		if (this.indexTime.minute === 0 && this.indexTime.second === 0) {
			this.showTimer = 0;
			this.$router.replace({ name: 'issue' });
		} else {
			this.timer();
		}
	},
	destroyed() {
		clearInterval(this.timerId);
	}
};

</script>
