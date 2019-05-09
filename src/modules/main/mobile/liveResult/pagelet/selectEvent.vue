<template>
	<div class="m-select-event">
		<span :class="selectIndexClass" @click="showOption" >{{ showValue||placeholderDec}}</span>
		<div class="option" v-show="isOpen">
			<ul class="list" v-if="!isDisable">
				<li v-for="temp in optionList"  :key='temp.id' :class="optionClass(temp.id)"  @click="setSelected(temp)">
					<span>{{temp.name}}</span>
				</li>
			</ul>
			<div class="list-empty" v-else>
				No {{showName}} available
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'selectEvent',
	props: {
		name: {
			type: String,
			'default': ''
		},
		value: {
			type: Object,
			'default': () => {}
		},
		dataList: {
			type: Array,
			'default': () => [],
		},
		setData: {
			type: Function,
			required: true,
		}
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		showName() {
			return this.name;
		},
		showValue() {
			let val = '';
			if (!!this.value) {
				val = this.value.name || '';
			}
			return val;
		},
		placeholderDec() {
			return `Select ${this.firstUpperCase(this.showName)}`;
		},
		isDisable() {
			return this.dataList.length <= 0;
		},
		selectIndexClass() {
			return {
				'select-index': true,
				active: this.isOpen,
				disable: this.isDisable,
				empty: !this.showValue,
			};
		},
		optionList() {
			const list = this.dataList;
			const allName = this.placeholderDec;
			if (this.name !== 'sport' && list[0].name !== allName) {
				list.unshift({ name: allName, id: '' });
			}
			return list;
		},
	},
	methods: {
		show() {
			this.isOpen = true;
			document.addEventListener('click', this.clickOutside, false);
		},
		close() {
			this.isOpen = false;
			document.removeEventListener('click', this.clickOutside, false);
		},
		showOption() {
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
			const data = val.id ? val : {};
			if (data.id !== this.value.id) {
				this.setData({ [this.name]: data });
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
	destroyed() {
		document.removeEventListener('click', this.clickOutside, false);
	}
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.m-select-event{
	display: block;
	position: relative;
	z-index: 50;
	width: 100%;
	.select-index{
		display: block;
		margin: 0 17/@rem;
		border-bottom: 1px solid @fogGray;
		height: 48/@rem;
		font-size: 16/@rem;
		font-weight: bold;
		line-height: 48/@rem;
		position: relative;
		color: @green;
		padding-right: 30/@rem;
		cursor: pointer;
		.m-icon-arrow--down();
		.ellipsis();
		&:before{
			display: inline-block;
			position: absolute;
			font-weight: bold;
			right: 10/@rem;
			color: @darkGray;
		}
		&.empty{
			color: @darkGray;
			font-weight: normal;
		}
		&.disable{
			color: @midGray!important;
			font-weight: normal;
		}
		&.active{
			.m-icon-arrow--up();
		}
	}
	.option{
		width: 100%;
		z-index: 50;
		box-sizing: border-box;
		background-color: #fcfcfc;
		box-shadow: inset 0 0 9px 0 rgba(0, 0, 0, 0.03);
		.list{
			display: block;
			li{
				display: block;
				height: 42/@rem;
				line-height: 42/@rem;
				font-size: 14/@rem;
				font-weight: normal;
				padding: 0 20/@rem;
				span{
					color: @darkGray;
					display: block;
					padding-left: 15/@rem;
					height: 100%;
					text-decoration: none;
					.ellipsis();
					&:active,&:visited,&:hover{
						background-color: @fogGray;
						text-decoration: none;
					}
				}
				&.active{
					span{
						color: @green;
					}
				}
				&.empty{
					span {color: @midGray;}
				}
			}
		}
		.list-empty{
			width: 100%;
			padding-top: 35/@rem;
			font-size: 14/@rem;
			height: 50/@rem;
			color: @darkGray;
			text-align: center;
		}
	}
}
</style>
