<template>

<div class="m-dp-gh-conf">
    <topNavBar :backClick="backHandler"><i slot="right" class="m-icon-help" @click.stop="depositHelp"></i></topNavBar>
    <div class="m-dp-main">
        <h2 class="f-title">Already Completed?</h2>
        <p class="f-content">Online deposit has been initiated on your phone. Please follow instructions on the prompt to complete deposit. If you already done, tap on the "Completed" button to confirm.</p>
        <div class="m-dp-btn-wrapper">
            <AfButton extraType="text" @click.prevent="verifyStatus">Cancel</AfButton>
            <AfButton extraType="primary" @click.prevent="verifyStatus">Completed</AfButton>
        </div>
    </div>
</div>

</template>

<script>
import {
	mapActions
} from 'vuex';

import topNavBar from 'components/navbar';
import AfButton from 'packages/button/button.vue';

import dpNavMixin from '../js/dpNavMixin';

export default {
	mixins: [
		dpNavMixin
	],
	components: {
		topNavBar,
		AfButton,
	},
	methods: {
		...mapActions('deposit', [
			'queryInfo'
		]),
		verifyStatus() {
			this.loadPop = this.$dialog({
				title: null,
				css: 'es-dialog-toast',
				content: '<i class="m-icon--loading"></i>Being processed...',
				button: []
			});

			this.queryInfo();
		}
	}
};

</script>

<style lang="less">
@import '../style/confirm.less';
</style>
