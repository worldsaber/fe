<template>
	<datepicker 
		:disabled="disabled" 
		input-class ="date-input" 
		v-model="indexDate" 
		calendar-class="date-size"
		v-on:selected="setDate"
		:inline="true"
	/>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { UPDATE_SELECTED, UPDATE_PAGENUM } from 'store/liveResult/mutationTypes';
import Datepicker from 'vuejs-datepicker';

export default {
	name: 'dataEvent',
	components: {
		Datepicker,
	},
	props: {
		clickHandler: {
			type: Function,
			'default': () => { }
		},
	},
	computed: {
		...mapState('liveResult', ['selected']),

		indexDate() {
			return this.selected.date;
		},
	},
	data() {
		return {
			disabled: {
				from: new Date(),
			}
		};
	},
	methods: {
		...mapMutations('liveResult', {
			setDateTime: UPDATE_SELECTED,
			clearPageNum: UPDATE_PAGENUM
		}),
		...mapActions('liveResult', ['getOption']),
		setDate(val) {
			this.setDateTime({ date: val });
			this.clearPageNum(1);
			this.getOption();
			this.clickHandler();
		}
	}
};
</script>
<style lang="less">
@import '~base/style/variable.less';
.date-size.vdp-datepicker__calendar{
	width: 100%;
	max-height: 260px;
	font-size: 12px;
	border-color: transparent;
	.cell{
		&.day{
			width: 20px;
			height: 20px;
			line-height: 20px;
			margin: 5px 6px;
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
</style>
