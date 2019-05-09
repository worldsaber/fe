<template lang="html">
	<div class="m-page-wrapper">
		<div v-if="showPage('index')">
			<div class="m-img-wrapper" v-if="bannerImg">
				<img :src="bannerImg" alt="">
			</div>
			<Login />
		</div>
		<Sms v-if="showPage('sms')" />
		<Success v-if="showPage('success')"/>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { objType } from 'utils';
import Login from './pagelet/register.vue';
import Sms from './pagelet/sms.vue';
import Success from './pagelet/success.vue';
import './js/tj';

const defaultImg = require('./image/topBanner.png');

export default {
	name: 'ActivityReg',

	props: {
		topImg: {
			type: String,
			defult: ''
		},
		// 是否有首页
		hasIndex: {
			type: Boolean,
			'default': true
		},
		// 是否有sms页面
		hasSms: {
			type: Boolean,
			'default': true
		},
		// 是否有成功页
		hasSuc: {
			type: Boolean,
			'default': true
		}
	},

	components: {
		Login,
		Sms,
		Success
	},

	data() {
		return {
			bannerImg: objType(this.topImg) === 'null' ? '' : this.topImg || defaultImg,
			modulePath: []
		};
	},

	computed: {
		...mapState('activityRegister', [
			'moduleName'
		]),
	},

	methods: {
		showPage(name) {
			return name === this.moduleName && this.modulePath.includes(name);
		}
	},

	created() {
		this.hasIndex && this.modulePath.push('index');
		this.hasSms && this.modulePath.push('sms');
		this.hasSms && this.modulePath.push('success');
	}
};
</script>

<style lang="less">

.m-page-wrapper {
	.m-img-wrapper {
		width: 100%;
		height: 413px;

		> img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
