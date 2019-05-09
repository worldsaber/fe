<template lang="html">
	<div class="m-nav-wrapper" id="m-order-nav">
		<ul class="m-nav">
			<li
				v-for="(item, key) in orderConfig"
				:class="['m-nav-item', {'m-nav-item--active': curOrderType === key }]"
				@click="changeOrderType(key)"
			>{{item}}</li>
		</ul>
		<div class="m-wrap">
			<ul class="m-type">
				<li
					v-for="filterItem in filterConfig"
					:class="['m-type-item', {'m-type-item--active': curSettleType === filterItem}]"
					@click="changeSettleType(filterItem)"
				><span class="m-text-main">{{filterItem}}</span></li>
			</ul>
			<div class="m-date" v-if="'sports' === curOrderType">
				<div class="date-label" @click="pickDate">{{dateRange}}<i class="arrow-icon"/></div>
			</div>
		</div>
		
	</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat.js';
import { orderTypeMap } from 'config/order/orderType';
import datepickerDialog from './datepickerDialog.vue';

export default {
	props: {
		settleType: {
			String,
			'default': 'settled'
		},
		orderType: {
			String,
			'default': 'sports'
		}
	},
	data() {
		return {
			from: '',
			to: '',
			curOrderType: '',
			curSettleType: '',
			orderConfig: orderTypeMap,
			filterConfig: ['all', 'settled', 'unsettled']
		};
	},
	computed: {
		dateRange() {
			if (this.from && this.to) {
				return dateFormat.format(this.from, 'DD/MM/YY') + ' - ' + dateFormat.format(this.to, 'DD/MM/YY');
			}
			return 'All Dates';
		}
	},
	created () {
		this.curOrderType = this.orderType;
		this.curSettleType = this.settleType;
	},

	methods: {
		changeSettleType (type) {
			if (type !== this.curSettleType) {
				this.curSettleType = type;
				this.$emit('changeSettleType', type);
			}
		},

		changeOrderType (type) {
			if (type !== this.curOrderType) {
				this.curOrderType = type;
				this.$router.push({
					name: type
				});
				this.$emit('changeType', type);
			}
		},

		pickDate() {
			const d = this.$dialog({
				title: 'Choose a range',
				content: datepickerDialog,
				contentData: {
					from: this.from,
					to: this.to
				},
				button: []
			});
			d.onMounted(() => {
				d.$content.$on('update', options => {
					this.from = options.from;
					this.to = options.to;
					this.$emit('update', this.from, this.to);
				});
				d.$content.$on('reset', () => {
					this.from = '';
					this.to = '';
					this.$emit('reset');
				});
			});
		}
	},
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

#m-order-nav.m-nav-wrapper {
	background-color: @white;
	padding: 8px 20px;
	.m-nav {
		border-bottom: 1px solid @lightGray;
		margin-bottom: -3px;
	}

	.m-nav-item {
		display: inline-block;
		padding: 7px;
		box-sizing: border-box;
		text-transform: capitalize;
		font-size: 14px;
		margin-right:22px;
		cursor: pointer;
	}

	.m-nav-item--active {
		font-size:16px;
		font-weight: bold;
		border-bottom: 3px solid @green;
	}
	
	.m-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		padding: 15px 0 10px;
		box-sizing: border-box;
		
		.m-type {
			flex: 1 1 auto;
			text-transform:capitalize;
	
			.m-type-item {
				display: inline-block;
				height: 32px;
				width: 68px;
				margin-right: 4px;
				text-align: center;
				line-height: 32px;
				box-sizing: border-box;
				cursor: pointer;
				border: 1px solid @fogGrayBorder;
				background-color: @white;
				color: @dark;
				.m-text-main {
					font-size: 12px;
				}
			}
	
			.m-type-item--active {
				border: 1px solid @green;
				background-color: @green;
				color: @white;
				.m-text-main {
					font-size: 12px;
				}
			}
		}
		.m-date {
			flex: 0 0 auto;
			.date-label {
				width: 128px;
				border: 1px solid @midGray;
				font-size: 12px;
				line-height: 30px;
				color: @dark;
				padding: 0 21px 0 10px;
				position: relative;
				
				.arrow-icon {
					position: absolute;
					top: 2px;
					right: 3px;
					.m-icon-arrow-down2();
					color: @green;
				}
			}
			.date-value {
				display: inline-block;
				vertical-align: middle;				
				margin-right: 6px;
				.date-input {
					cursor: pointer;
					height: 32px;
					line-height: 32px;
					width: 68px;
					background-color: @white;
					border: 1px solid @fogGrayBorder;
				}
			}
			.action {
				cursor: pointer;
				display: inline-block;
				vertical-align: middle;
				height: 22px;
				line-height: 22px;
				width: 48px;
				text-align: center;
				background-color: @white;
				border: 1px solid @fogGrayBorder;
				
				&.green {
					margin-right: 6px;
					color: @white;
					background-color: @green;
					border-color: @green;
				}
			}
		}
	}
	

	.m-text-main {
		.m-text-main();
		font-size: 12px;
		font-weight: 500;
	}
}
</style>
