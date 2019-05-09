<template>
  <div class="m-fix-pop">
    <topNavBar :backClick="backHandler"></topNavBar>
		<div class="m-pesa-box">
			<h2>Already Completed?</h2>
			<p>Lipa na M-PESA Online transaction has been initiated on your phone! Please enter service pin to confirm the deposit! If you already entered it, tap on the "Completed" button to confirm.</p>
			<div class="m-pesa-btn-bar">
					<AfButton
							extraType="text"
							@click.prevent="submitHandler"
							>Cancel</AfButton>
					<AfButton
						extraType="primary"
						@click.prevent="submitHandler"
						>Completed</AfButton>
			</div>
		</div>
  </div>
</template>
<script>
import { EventBus } from 'kernel/js/eventBus.js';
import topNavBar from 'components/navbar';
import AfButton from 'packages/button/button.vue';
import popMsg from '../js/popMsg';

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
		AfButton,
	},
	data () {
		return {
			// loading: false,
			loadPop: ''
		};
	},
	mounted() {
		EventBus.$on('completeLoadingChange', status => {
			// this.loading = status; // 修改loading状态
			if (!status) {
				this.hideLoading();
			}
		});
	},
	methods: {
		hideLoading () {
			if (this.loadPop) {
				this.loadPop.close();
			}
		},
		backHandler () {
			this.$emit('hideMpesaPop', 1);
		},
		submitHandler () {
			// this.loading = true;
			this.loadPop = this.showLoading('<i class="m-icon--loading"></i>Being processed...');
			this.$emit('mpesaBtnClick', 1);
		}
	},
	beforeDestroy () {
		if (this.loadPop) {
			this.loadPop.close();
		}
	},
	destroyed() {
		EventBus.$off('completeLoadingChange');
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.m-pesa-box{
  width: 91%;
	margin:0 auto;
	h2{
		font-size: 18/@rem;
		text-align: center;
		font-weight: bold;
		padding: 38/@rem 0;
	}
  p{
    line-height: 26/@rem;
		font-size: 14/@rem;
		line-height: 18/@rem;
    margin:0 16/@rem 70/@rem;
	}
	.m-pesa-btn-bar{
		height:48/@rem;
	}
	.af-button{
		display: inline-block;
		&.af-button--text{
			width:28%;
			float: left;
			border:1px solid @darkGray!important;
			border-radius: 2/@rem;
			color:@darkGray;
			font-size:15/@rem;
			color:@dark!important;
		}
		&.af-button--primary{
			float: right;
			width:69.8%;
			font-size: 16/@rem;
			font-weight: bold;
		}
	}
}
</style>
