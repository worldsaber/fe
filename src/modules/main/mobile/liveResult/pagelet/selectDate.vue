<template>
	<div :class="['m-select-date',{isOpen: isOpen}]">
		<i class="subtract-date" @click="changeDate(-1)"></i>
		<span :class="selectIndexClass" @click="showOption" >{{ indexDate || placeholderDec}}</span>
		<i :class="['add-date', {disable: isDisable}]" @click="changeDate(1)"></i>
		<div class="option" v-if="isOpen">
			<div class="date-com">
				<datepicker
					:disabled="disabled"
					input-class ="date-input"
					:value="selected.date"
					calendar-class="date-size"
					v-on:selected="setDate"
					:inline="true"
				/>
				<div class="date-bottom">
					<span @click="close">CANCEL</span>
					<span :class="{unchange:!selectedDate}" @click="changeDate">OK</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { UPDATE_SELECTED } from 'store/liveResult/mutationTypes';
import Datepicker from 'vuejs-datepicker';
import dateFormat from 'kernel/js/dateFormat';
import 'components/dialog';

export default {
	name: 'selectDate',
	components: {
		Datepicker,
	},
	data() {
		return {
			isOpen: false,
			placeholderDec: 'Select Date',
			selectedDate: null,
			disabled: {
				from: new Date(),
			},
			lock: false
		};
	},
	computed: {
		...mapState('liveResult', ['selected']),

		indexDate() {
			return this.selected.date ? dateFormat.format(this.selected.date, 'DD/MM/YYYY') : '';
		},
		isDisable() {
			let flag = false;
			const d = new Date(this.selected.date);
			d.setDate(d.getDate() + 1);
			if (d > new Date()) {
				flag = true;
			}
			return flag;
		},
		selectIndexClass() {
			return {
				'select-index': true,
				empty: !this.indexDate,
			};
		},
	},
	methods: {
		...mapMutations('liveResult', {
			updateDateTime: UPDATE_SELECTED,
		}),
		...mapActions('liveResult', ['getOption']),
		show() {
			this.isOpen = true;
			document.documentElement.style = { overflow: 'hidden' };
			document.body.style = { overflow: 'hidden' };
		},
		close() {
			this.isOpen = false;
			document.body.style = { overflow: 'auto' };
		},
		setDate(val) {
			this.selectedDate = val;
		},
		changeDate(val) {
			const oldDate = this.selected.date;
			if (this.lock) return;
			this.lock = true;
			if (typeof val === 'number') {
				const d = new Date(oldDate);
				d.setDate(d.getDate() + val);
				if (d > new Date()) {
					this.lock = false;
					return;
				}
				this.updateDateTime({ date: d });
			} else if (this.selectedDate) {
				this.updateDateTime({ date: this.selectedDate });
				this.selectedDate = null;
				this.close();
			} else {
				this.close();
				return false;
			}
			this.getOption().then(() => {
				this.lock = false;
			}, () => {
				this.$dialog.toast('Please check your internet connection and try again.');
				this.updateDateTime({ date: oldDate });
				this.lock = false;
			});
		},
		showOption() {
			if (this.isOpen) {
				return this.close();
			}
			this.show();
		},
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-select-date{
	height: 36/@rem;
	display: block;
	position: relative;
	z-index: 50;
	padding-left: 10/@rem;
	margin-bottom: 11/@rem;
	.select-index,.subtract-date, .add-date{
		display: inline-block;
		width: 54%;
		height: 100%;
		font-size: 14/@rem;
		font-weight: bold;
		line-height: 36/@rem;
		background: @green;
		border-radius: 2px;
		position: relative;
		color: @white;
		text-align: center;
		margin: 0 4/@rem;
		vertical-align:top;
		cursor: pointer;
		.ellipsis();
		&.empty{
			opacity: 0.4;
		}
		&.disable{
			background-color: @fogGray;
			color:fade(@darkGray, 50%);
			opacity: 1;
		}
	}
	.subtract-date, .add-date{
		display: inline-block;
		width: 20%;
		margin: 0;
		.m-icon-back();
	}
	.add-date{
		.m-icon-arrow--right();
	}
	.option{
		@rem: 14rem;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 500;
		background: fade(#000000,60%);
		overflow:hidden;
		.date-com{
			width: 330/@rem;
			margin: 35% auto 0;
			padding-top: 10/@rem;
			background-color: @white;
			border-radius: 2px;
			.date-bottom{
				height: 52/@rem;
				text-align: right;
				span{
					padding: 0 20/@rem;
					margin-right: 10/@rem;
					display: inline-block;
					color: @green;
					line-height: 40/@rem;
					font-size: 14px;
					&.unchange{
						color: @midGray;
					}
				}
			}
		}
		.date-size.vdp-datepicker__calendar{
			font-size: 14/@rem;
			width: 300/@rem;
			border-color: transparent;
			margin: 0 auto;
			.cell{
				&.day-header{
					background-color: @fogGray;
					height: 27/@rem;
					line-height: 27/@rem;
					margin-bottom: 5/@rem;
				}
				&.day{
					height: 40/@rem;
					line-height: 40/@rem;
					padding: 0;
				}

				border-radius: 2px;
				&:not(.blank):not(.disabled){
					&.day,&.month,&.year{
						&:hover{
							border-color:  @green;
						}
					}
				}

				&.selected,&.selected.highlighted, &.selected:hover{
					background: @green;
					color: @white;
				}
			}

		}
	}
	&.isOpen{
		z-index: 500;
	}
}
</style>
