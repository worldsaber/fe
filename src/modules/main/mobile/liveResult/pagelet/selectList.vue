<template>
	<div class="m-select-list">
		<span :class="['selected',{disable: isDisable}]" @click="showOption" >{{ showValue }}</span>
		<div class="list-content" v-if="isOpen">
			<div class="select-com">
				<i class="close" @click="close" ></i>
				<div class="select-content">
					<SelectEvent name="sport" :value="tempSelected.sport" :dataList="optionList" :setData="changeSelect"/>
					<SelectEvent name="category" :value="tempSelected.category" :dataList="categoriesList" :setData="changeSelect"/>
					<SelectEvent name="tournament" :value="tempSelected.tournament" :dataList="tournamentList" :setData="changeSelect"/>
				</div>
				<div class="select-bottom">
					<span :class="['reset',{change: !isDefault}]" @click="resetSelect">Reset</span>
					<span :class="['apply',{change:isChange}]" @click="applySelect">Apply</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { UPDATE_SELECTED } from 'store/liveResult/mutationTypes';
import SelectEvent from './selectEvent.vue';

export default {
	name: 'selectList',
	components: {
		SelectEvent
	},
	data() {
		return {
			isOpen: false,
			isInit: true,
			isChange: false,
			isDefault: false,
			tempSelected: {},
			categoriesList: [],
			tournamentList: [],
		};
	},
	computed: {
		...mapState('liveResult', ['selected', 'optionList']),
		showValue() {
			const indexSport = this.selected.sport.name || 'All Sports';
			const indexCategory = this.selected.category.name || 'All Categories';
			const indexTournament = this.selected.tournament.name || 'All Tournaments';
			return `${indexSport} / ${indexCategory} / ${indexTournament}`;
		},
		selectIndexClass() {
			return {
				'select-index': true,
				active: this.isOpen,
				empty: !this.showValue,
			};
		},
		isDisable() {
			return !this.selected.sport.id;
		},
		defaultSelect() {
			let data = {};
			if (this.optionList.length) {
				data = {
					name: this.optionList[0].name,
					id: this.optionList[0].id,
				};
			}
			return {
				date: this.selected.date,
				sport: data,
				category: {},
				tournament: {}
			};
		},
	},
	watch: {
		selected: {
			deep: true,
			handler(val) {
				this.tempSelected = Object.assign({}, val);
			}
		},
		tempSelected: {
			deep: true,
			handler(val) {
				this.isChange = JSON.stringify(val) !== JSON.stringify(this.selected);
				this.isDefault = JSON.stringify(val) === JSON.stringify(this.defaultSelect);
				this.getCategoriesList();
				this.getTournamentList();
			}

		}
	},
	methods: {
		...mapMutations('liveResult', {
			setSelect: UPDATE_SELECTED,
		}),
		...mapActions('liveResult', ['getResultList']),
		show() {
			this.isOpen = true;
		},
		close() {
			this.isOpen = false;
			this.tempSelected = Object.assign({}, this.selected);
		},
		showOption() {
			if (this.isOpen) {
				return this.close();
			}
			this.show();
		},
		changeSelect(data) {
			if (data.sport) {
				data.category = {};
				data.tournament = {};
			} else if (data.category) {
				data.tournament = {};
			}
			Object.assign(this.tempSelected, data);
		},
		resetSelect() {
			this.changeSelect(this.defaultSelect);
		},
		applySelect() {
			if (this.isChange) {
				this.setSelect(this.tempSelected);
				this.getResultList();
				this.close();
			}
		},
		getCategoriesList() {
			let list = [];
			const index = this.tempSelected.sport.id;
			if (index) {
				const sportList = this.optionList;
				for (let i = 0, len = sportList.length; i < len; i++) {
					const val = sportList[i];
					if (index === val.id) {
						list = val.categories;
						break;
					}
				}
			}
			this.categoriesList = list;
		},
		getTournamentList() {
			let list = [];
			const index = this.tempSelected.category.id;
			if (index) {
				const categoriesList = this.categoriesList;
				for (let i = 0, len = categoriesList.length; i < len; i++) {
					const val = categoriesList[i];
					if (index === val.id) {
						list = val.tournaments;
						break;
					}
				}
			}
			this.tournamentList = list;
		},
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.m-select-list{
	height: 34/@rem;
	display: block;
	position: relative;
	z-index: 50;
	padding: 0 10/@rem;
	.selected{
		display: block;
		height: 100%;
		font-size: 12/@rem;
		line-height: 34/@rem;
		padding-left: 8/@rem;
		background: @fogGray;
		border-radius: 2/@rem;
		position: relative;
		color: @dark;
		padding-right: 60/@rem;
		cursor: pointer;
		
		.ellipsis();
		&:before{
			content: 'Change';
			display: inline-block;
			position: absolute;
			font-weight: bold;
			right: 10/@rem;
			color: @green;
		}
		&.empty{
			opacity: 0.4;
		}
		&.disable{
			background-color: @fogGray;
			color:fade(@darkGray, 50%);
			opacity: 1;
		}
	}
	.list-content{
		@rem: 14rem;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 500;
		background: fade(#000000,60%);
		overflow:hidden;
		.select-com{
			height: 80%;
			position: absolute;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			padding-top: 30/@rem;
			padding-bottom: 70/@rem;
			background-color: @white;
			.close{
				display: block;
				position: absolute;
				border-width: 0 32/@rem 32/@rem 32/@rem;
				border-style: solid;
				border-color: @dark  transparent ;
				font-size: 0;
				width: 0;
				top: -32/@rem;
				right: 10/@rem;
				.m-icon-close();
				&:before{
					position: absolute;
					top: 7/@rem;
					left: -8/@rem;
					color: @white;
				}
			}
			.select-content{
				height: 100%;
				overflow-y: auto;
				overflow-x: hidden;
				& .select-index:first-of-type{
					border-top: 1px solid @fogGray;
				}
			}
			.select-bottom{
				width: 100%;
				height: 60/@rem;
				position: absolute;
				text-align: center;
				bottom: 0;
				font-size: 16/@rem;
				padding-top: 12/@rem;
				.apply,.reset{
					display: inline-block;
					box-sizing: border-box;
					background-color: @white;
					border: 1px solid @midGray;
					color: @midGray;
					font-size: 16/@rem;
					height: 48/@rem;
					line-height: 48/@rem;
					border-radius: 2px;
					width: 65%;
					text-align: center;
					&.change{
						border-color: @green;
						background-color: @green;
						color: @white;
					}
				}
				.reset{
					width: 28%;
					text-align: center;
					margin-right: 5/@rem;
					&.change{
						background-color: @white;
						border-color: @green;
						color: @green;
					}
				}
			}
		}
		
	}
}
</style>
