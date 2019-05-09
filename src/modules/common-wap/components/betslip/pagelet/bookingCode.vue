<template>
	<!-- 必须阻止时间冒泡 -->
	<div class="booking-code" @click.stop="!!false">
		<Back :backClick="handleBack"/>
		<div v-loading:getCode="loading" class="code-loading">
			<div v-if="loading === false">
				<div v-if="!noData">
					<p class="title">The bet has been booked</p>
					<p class="sub-title">Booking Code:</p>
					<p class="code">{{code}}</p>
					<p class="date">{{time}}</p>
					<div class="share-btn" @click="showShare = true">Share</div>
				</div>
				<div v-else>Please choose some games!</div>
			</div>
		</div>
		<FooterBar/>
		<Share @close-share="showShare = false" :shareCfg="shareCfg" v-if="showShare"/>
	</div>	
</template>

<script>
	/**
	 * 该模块不适合做成一个前端路由模块，因为betslip可能在任意一个页面嵌入，
	 * 这个时候这个模块如果是前端路由模块，则需要在嵌入betslip的页面都加上路由，太麻烦了
	 * 所以直接做成一个模块，带footer，不用前端路由
	 */
	import Back from 'components/navbar';
	import FooterBar from 'components/layout/pagelate/footer';
	import { mapState } from 'vuex';
	import dateFormat from 'kernel/js/dateFormat';
	import { pagePath } from 'config/pageConfig';
	import 'components/share';

	export default {
		props: {
			isShowBookingCode: {
				type: Boolean,
				'default': false,
				noData: false
			}
		},
		data () {
			return {
				code: '',
				loading: false,
				time: '',
				showShare: false,
				shareCfg: {
					url: `${location.origin}${pagePath.preFootball}`
				}
			};
		},
		model: {
			prop: 'isShowBookingCode',
			event: 'input'
		},
		components: {
			Back,
			FooterBar
		},
		watch: {
			code (val) {
				if (val) {
					this.shareCfg.url = `${location.origin}${pagePath.home}?shareCode=${val}`;
				}
			}
		},
		created () {
			this.getCode();
		},
		computed: {
			...mapState('betslip', ['betslips']),
		},
		methods: {
			getParam () {
				const selections = [];
				for (const item of this.betslips) {
					const marketInfo = item.marketInfo || {},
						outcomeInfo = item.outcomeInfo || {};
					if (item.eventId && marketInfo.marketId && outcomeInfo.id) {
						selections.push({
							eventId: item.eventId,
							marketId: marketInfo.marketId,
							specifier: marketInfo.specifier || null,
							outcomeId: outcomeInfo.id
						});
					}
				}
				return selections;
			},
			// 获取 code，哈哈哈，心情好
			getCode () {
				this.loading = true;
				this.noData = false;
				const t = new Headers();
				t.append('Content-Type', 'application/json;charset=UTF-8');
				t.append('OperId', window.operId);
				fetch('/orders/share', {
					method: 'POST',
					body: JSON.stringify({ selections: this.getParam() }),
					headers: t
				})
				.then(res => res.json())
				.then(ret => {
					const code = ret.bizCode;
					if (code === 10000) {
						// console.log(ret.data);
						if (!ret.data || !ret.data.shareCode) {
							this.noData = true;
							return;
						}
						this.code = ret.data.shareCode;
						this.time = dateFormat.format(new Date().getTime(), 'HH:mm:ss DD/MM/YYYY');
						this.loading = false;
						return;
					}
					this.loading = -1;
				})
				.catch(err => {// eslint-disable-line
					this.loading = -1;
				});
			},
			handleBack () {
				this.$emit('input', false);
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '~base/styles/variable.less';
	@import 'base/styles/icon.less';
	.booking-code{
		position: absolute;
		left: 0;
		top: 0;
		z-index: 23;
		height: 100%;
		width: 100%;
		background-color: @white;
		text-align: center;
		color: @blueBlack;
		overflow: auto;
		.code-loading{
			min-height: 42%;
		}
		.title {
			margin-top: 40/@rem;
			margin-bottom: 23/@rem;
			line-height: normal;
			color: @green;
			font-size: 16/@rem;
			.m-icon-success-bg();
			&:before{
				color: @green;
				font-size: 16/@rem;
				padding-right: 10/@rem;
			}
		}
		.sub-title{
			font-size: 14/@rem;
			line-height: normal;
		}
		.code {
			font-size: 28/@rem;
			line-height: normal;
		}
		.date{
			color: @darkGray;
			margin-bottom: 30/@rem;
		}
		.share-btn{
			border-radius: 2/@rem;
			width: 39%;
			margin: 0 auto;
			height: 44/@rem;
			line-height: 44/@rem;
			color: @white;
			font-size: 14/@rem;
			background-color: @green;
			.m-icon-share();
			&:before{
				font-size: 22/@rem;
				display: inline-block;
				padding-right: 20/@rem;
				vertical-align: middle;
				color: @white;
			}
			&:active{
				background-color: @midGreen;
			}
		}
	}
</style>
