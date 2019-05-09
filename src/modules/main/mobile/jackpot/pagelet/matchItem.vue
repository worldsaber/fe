<template>
	<dl class="match-item">
		<dt class="no">{{index + 1}}</dt>
		<dd class="date-matche"><span>{{startTime}}</span><br>{{matchData.home}}<br>{{matchData.away}}</dd>
		<dd class="odds">
			<ul class="outcome">
				<li v-for="(item,i) in outcomes" :key="item.id" :class="[oddsClass[i],{'active': selected.search(item.id) >= 0 }]">
					<a href="javascript:;" @click="setBets(item,i)">{{item.odds}}</a>
				</li>
			</ul>
		</dd>
	</dl>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';

export default {
	name: 'matchItem',
	props: {
		index: 0,
		matchData: {
			type: Object,
			'default': () => { },
		},
		disable: false,
		selectItems: {
			type: Object,
			'default': () => { },
		},

	},
	data() {
		return {
			selected: '',
			oddsClass: [
				'home',
				'draw',
				'away',
			],
			h2hOpen: false,
		};
	},
	computed: {
		...mapState('jackpot', ['selections', 'status']),
		outcomes() {
			return this.initData();
		},
		// 格式话比赛开始时间
		startTime() {
			const data = +this.matchData.date || 0;
			return data > 0 ? this.formatDate(+data / 1000) : '';
		},
		// 重置选项标志数据
		allSelectedSize() {
			return this.selections.itemsSize;
		},
		// 默认选项
		defaultSelect() {
			return this.selectItems[this.index] || '';
		}
	},
	watch: {
		allSelectedSize(val) {
			if (val === 0) {
				this.initData();
				this.selected = '';
			}
		},
	},
	methods: {
		...mapActions('jackpot', [
			'setSelectItem',
		]),
		initData() {
			const data = this.matchData.outcomes || [];
			return data.map(ev => {
				const isSelected = this.selected.indexOf(ev.id);
				ev.state = isSelected >= 0;
				return ev;
			});
		},
		randomPick() {
			const id = Math.ceil(Math.random() * 3).toString();
			const item = this.outcomes[id - 1];
			const obj = {
				eventId: this.matchData.eventId,
				id
			};
			const data = {
				item: JSON.stringify(obj),
				key: this.index,
			};
			item.state = !item.state;
			if (item.state) {
				this.selected = this.selected + item.id;
			} else {
				this.selected = this.selected.replace(item.id, '');
			}
			data.selected = this.selected;
			this.setSelectItem(data);
		},
		setBets(item, i) {
			if (this.disable) return;
			const obj = {
				eventId: this.matchData.eventId,
				id: item.id,
			};
			const data = {
				item: JSON.stringify(obj),
				key: this.index,
			};
			item.state = !item.state;
			if (item.state) {
				this.selected = this.selected + item.id;
			} else {
				this.selected = this.selected.replace(item.id, '');
			}
			data.selected = this.selected;
			this.setSelectItem(data);
		},
		formatDate(date, style) {
			const regular = style || 'DD/MM/YYYY HH:mm';
			const temp = new Date(date * 1000);
			return dateFormat.format(temp, regular);
		},
	},
	mounted() {
		if (this.defaultSelect.length > 0) {
			this.selected = this.defaultSelect;
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
.match-item {
	width: 100%;
	display: table;
	vertical-align: middle;
	text-align: center;
	font-size: 12/@rem;
	color:@white;

	dd,
	dt {
		display: table-cell;
		vertical-align: middle;
		border-bottom: 1/@rem solid #454D60;
		padding:8px 0;
		&.no {
			display: inline-block;
			text-align: center;
			font-size: 12/@rem;
			line-height: 18/@rem;
		}
		&.date-matche{
			span{
				font-weight: normal;
				color: @darkGray;
			}
			color: @fogGray;
			font-weight: 500;
		}
		&.odds {
			.outcome {
				li {
					display: table-cell;
					width: 33.3%;
					border-right: 1px solid @blueBlack;
					vertical-align: middle;
					color: @white;
					font-size: 12/@rem;
					a, a:active, a:hover {
						color: @midGreen;
						display: block;
						height: 40/@rem;
						line-height: 40/@rem;
						border-radius: 2px;
						font-weight: bold;
						background-color: rgba(214, 235, 220, 0.13);
						text-decoration: none;
						.disable & {
							background-color: fade(@white, 15%);
							color: @darkGray;
						}
					}
					&.active {
						a, a:active, a:hover {
							background-color: @lightGreen;
							color: @black;
						}
					}
				}
			}
		}
	}
	dt {
		border: 0;
	}
}
</style>
