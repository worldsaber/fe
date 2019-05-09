<template>
	<div class="datepicker-wrap">
		<div class="m-date">		
			<span class="date-label">From</span>
			<datepicker class="date-value" v-model="from" :format="dateFormat" placeholder="dd/mm/yy" :disabled="disableFrom" :input-class="'date-input'" @input="fromChange"></datepicker>
			<span class="date-label to">To</span>
			<datepicker class="date-value" v-model="to" :format="dateFormat" placeholder="dd/mm/yy" :disabled="disableTo" :input-class="'date-input'" @input="toChange"></datepicker>
		</div>
		<div class="error-wrap">
			<div class="from-error">{{fromErr}}</div>
			<div class="to-error">{{toErr}}</div>
		</div>
		<div class="date-action">
			<div class="action" @click="resetDate">Back to All Dates</div>
			<div class="action green" @click="update">Update</div>
		</div>
	</div>
</template>

<script>
import datepicker from 'vuejs-datepicker';
import dateFormat from 'kernel/js/dateFormat.js';

export default{
	components: {
		datepicker
	},
	data() {
		return {
			from: '',
			to: '',
			dateFormat: 'dd/MM/yy',
			fromErr: '',
			toErr: ''
		};
	},
	created() {
		this.from = this.contentData.from ? this.contentData.from : '';
		this.to = this.contentData.to ? this.contentData.to : '';
	},
	computed: {
		disableFrom() {
			return {
				from: this.to ? new Date(this.to) : new Date()
			};
		},
		disableTo() {
			return {
				to: this.from ? new Date(this.from) : this.from,
				from: new Date()
			};
		}
	},
	watch: {
		from(val) {
			this.from = Date.parse(new Date(dateFormat.format(val, 'YYYY-MM-DD 00:00:00')));
		},
		to(val) {
			this.to = Date.parse(new Date(dateFormat.format(val, 'YYYY-MM-DD 23:59:59')));
		}
	},
	methods: {
		resetDate() {
			this.$emit('reset');
			this.$dialog();
		},
		fromChange() {
			this.fromErr = '';
		},
		toChange() {
			this.toErr = '';
		},
		update() {
			if (this.from && this.to) {
				this.$emit('update', {
					from: this.from,
					to: this.to
				});
				this.$dialog();
			} else {
				this.from || (this.fromErr = 'Please choose a start date.');
				this.to || (this.toErr = 'Please choose an end date.');
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

.datepicker-wrap {
	width: 400px;
	.m-date {
		display: flex;
		align-items: center;
		justify-content: center;
		
		.date-label {
			flex: 0 0 auto;
			font-size: 14px;
			line-height: 32px;
			margin-right: 6px;
			&.to {
				margin-left: 32px;
			}
		}
		
		.date-value {
			flex: 1 1 auto;
			width: 100px;
			.date-input {
				width: 100%;
				height: 30px;
				border: 1px solid @lightGray;
			}
			.vdp-datepicker__calendar {
				position: fixed;
			}
		}
	}
	
	.error-wrap {
		height: 48px;
		line-height: 16px;
		font-size: 12px;
		color: @red;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		
		.from-error {
			flex: 1 1 auto;
			width: 100px;
		}
		.to-error {
			flex: 1 1 auto;
			width: 100px;
			margin-left: 50px;
		}
	}
	.date-action {
		display: flex;
		align-items: center;
		justify-content: center;
		
		.action {
			flex: 0 0 auto;
			width:130px;
			line-height: 30px;
			border: 1px solid @lightGray;
			background-color: @lightGray;
			color: @dark;
			text-align: center;
			cursor: pointer;
			&.green {
				color: @white;
				background-color: @green;
				border-color: @green;
				margin-left: 40px;
			}
		}
	}
}
</style>
