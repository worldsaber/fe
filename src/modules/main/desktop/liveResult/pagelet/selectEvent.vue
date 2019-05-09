<template>
	<div class="m-select-list">
		<span :class="selectIndexClass" @click="showOption" >{{ showValue||placeholderDec}}</span>
		<div class="option" v-if="isOpen">
			<Datepicker v-if="isDate" :clickHandler="close"/>
			<ul class="list" v-else>
				<li v-for="temp in optionList"  :key='temp.id' :class="optionClass(temp.id)"  @click="setSelected(temp)">
					<a href="javascript:;">{{temp.name}}</a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
import { UPDATE_SELECTED, UPDATE_PAGENUM } from 'store/liveResult/mutationTypes';
import Datepicker from './datePicker.vue';

export default {
	name: 'selectEvent',
	components: {
		Datepicker,
	},
	props: {
		name: {
			type: String,
			'default': ''
		},
		value: {
			type: [Object, String],
			required: true
		},
		dataList: {
			type: Array,
			'default': () => [],
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		isDate() {
			return this.name === 'date';
		},
		showValue() {
			return this.isDate ? this.value : this.value.name;
		},
		placeholderDec() {
			return `Select ${this.firstUpperCase(this.name)}`;
		},
		isDisable() {
			return !this.isDate && this.dataList.length <= 0;
		},
		selectIndexClass() {
			return {
				'select-index': true,
				active: this.isOpen,
				disable: this.isDisable,
				// empty: !this.showValue,
			};
		},
		optionList() {
			const list = this.dataList;
			if (this.name !== 'sport' && list[0].name !== 'Clear Selection') {
				list.unshift({ name: 'Clear Selection', id: '' });
			}
			return list;
		},
	},
	methods: {
		...mapMutations('liveResult', {
			setDate: UPDATE_SELECTED,
			clearPageNum: UPDATE_PAGENUM
		}),
		...mapActions('liveResult', ['getResultList']),
		show() {
			this.isOpen = true;
			document.addEventListener('click', this.clickOutside, false);
		},
		close() {
			this.isOpen = false;
			document.removeEventListener('click', this.clickOutside, false);
		},
		showOption() {
			if (this.isDisable) return false;

			if (this.isOpen) {
				return this.close();
			}
			this.show();
		},
		clickOutside (event) {
			if (this.$el && !this.$el.contains(event.target)) {
				this.close();
				document.removeEventListener('click', this.clickOutside, false);
			}
		},
		setSelected(val) {
			const data = val.id ? val : { id: '' };
			if (data.id !== this.value.id) {
				this.setDate({ [this.name]: data });
				this.clearPageNum(1);
				this.getResultList();
			}
			this.close();
		},
		firstUpperCase: ([first, ...rest]) => first.toUpperCase() + rest.join(''),
		optionClass(val) {
			return {
				active: this.value.id === val,
				empty: !val
			};
		}
	},
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import '~base/style/icon.less';
.m-select-list{
	height: 36px;
	display: block;
	position: relative;
	z-index: 50;
	width: 100%;
	.select-index{
		display: block;
		height: 100%;
		font-size: 14px;
		font-weight: bold;
		line-height: 36px;
		padding-left: 8px;
		background: @green;
		border-radius: 2px;
		position: relative;
		color: @white;
		padding-right: 30px;
		cursor: pointer;
		.m-icon-arrow--down();
		.ellipsis();
		&:before{
			opacity: 0.4;
			display: inline-block;
			position: absolute;
			font-weight: bold;
			right: 10px;
		}
		&.empty{
			opacity: 0.4;
		}
		&.disable{
			background-color: @fogGray;
			color:fade(@darkGray, 50%);
			opacity: 1;
			cursor: no-drop;
			cursor: not-allowed;
		}
		&.active{
			background-color: @midGreen;
			opacity: 1;
			.m-icon-arrow--up();
			&:before{
				font-size: 13px;
				opacity: 1;
			}
		}
	}
	.option{
		position: absolute;
		width: 230px;
		top: 38px;
		z-index: 50;
		border:1px solid @fogGrayBorder;
		border-radius: 2px;
		/* box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.11); */
		box-shadow: 0 0 5px 0 fadeout(@black, 80%);
		box-sizing: border-box;
		.list{
			max-height: 260px;
			display: block;
			padding: 6px 0;
			overflow-y: auto;
			overflow-x: hidden;
			background: @white;

			li{
				display: block;
				height: 32px;
				line-height: 32px;
				font-size: 12px;
				font-weight: normal;
				a{
					color: @dark;
					display: block;
					padding-left: 15px;
					height: 100%;
					text-decoration: none;
					.ellipsis();
					&:active,&:visited,&:hover{
						background-color: @fogGray;
						text-decoration: none;
					}
				}
				&.active{
					a{
						color: @green;
					}
				}
				&.empty{
					a {color: @grayBorder;}
				}
			}
		}
	}
}
</style>
