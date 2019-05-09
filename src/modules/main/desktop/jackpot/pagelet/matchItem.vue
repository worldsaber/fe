<template>
	<dl class="match-item">
		<dt class="no">{{index+1}}</dt>
		<dd class="date">
			<span>{{startTime}}</span>
			<span class="print-item">{{startTime.split(' ')[0]}}</span>
		</dd>
		<dd class="time print-item">
			<span>{{startTime.split(' ')[1]}}</span>
		</dd>
		<dd class="match">{{matchData.home}}<br><span class="print-item"> - </span><em class="away">{{matchData.away}}</em></dd>
		<dd class="h2h">
			<a :class="['icon',{'active': h2hOpen}]" @click="showH2H" href="javascript:;"><i></i></a>
		</dd>
		<dd class="outcome">
			<ul>
				<li v-for="(item,i) in outcomes" :key="item.id" :class="[oddsClass[i],{'active': selected.search(item.id) >= 0 }]" @click="setBets(item,i)">
					<a href="javascript:;" :class="{'lock': lock}">{{item.odds}}</a>
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
		openH2hPop: {
			type: Function,
			'default': () => {},
		},
		h2hOpen: false,
	},
	data() {
		return {
			selected: '',
			oddsClass: [
				'home',
				'draw',
				'away',
			],
		};
	},
	computed: {
		...mapState('jackpot', ['selections', 'status', 'betStatus']),
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
		},
		lock() {
			return this.betStatus !== 'selecting';
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
			if (this.lock) return;
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
		showH2H() {
			if (this.disable) return;
			// this.h2hOpen = !this.h2hOpen;
			this.openH2hPop({
				[this.matchData.eventId]: !this.h2hOpen,
			});
		},
		formatDate(date, style) {
			const regular = style || 'D/M/YYYY HH:mm';
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
@import '~base/style/mixin.less';
@import '~base/style/variable.less';
@import 'base/style/icon.less';
.match-item {
	width: 100%;
	display: table;
	vertical-align: middle;
	text-align: center;
	font-size: 12px;

	dd,
	dt {
		display: table-cell;
		vertical-align: middle;
		border-bottom: 1px solid #454D60;
		&.print-item{
			display: none;
		}
		&.no {
			font-weight: bold;
		}
		&.date {
			line-height: 21px;
			font-size: 12px;
			text-align: left;
		}
		&.match {
			text-align: left;
			line-height: 14px;
			.away{
				display: inline-block;
				padding-top: 6px;
				font-weight: normal;
			}
		}
		&.h2h .icon {
			display: block;
			.m-icon-qushitu();
			color: @white;
			font-weight: bold;
			text-align: left;
			&:before {
				color: inherit;
			}
			&:hover {
				color: @midGreen;
				text-decoration: none;
			}
			&.active {
				color: @lightGreen;
				i{
					.m-icon-arrow-up2();
					color: @lightGreen;
					vertical-align: text-bottom;
					&::before{
						font-size: 10px;
					}
				}
			}
			.disable & {
				color: @darkGray;
			}
		}
		&.outcome {
			width: 278px;
			padding: 10px 0;
			ul {
				display: table;
				width: 100%;

				li {
					display: table-cell;
					vertical-align: middle;
					color: @white;
					font-size: 13px;
					a {
						color: inherit;
						display: block;
						height: 40px;
						line-height: 40px;
						border-radius: 2px;
						font-weight: bold;
						background-color: @green;
						&:active,
						&:hover {
							color: inherit;
							text-decoration: none;
						}
						&:hover {
							background: @midGreen;
						}
						.disable & {
							background-color: fade(@white, 15%);
							color: @darkGray;
						}
						&.lock:active, &.lock:visited, &.lock:hover{
							background-color: @green;
							cursor: no-drop;
							cursor: not-allowed;
						}
					}
					&.active {
						a {
							background-color: @lightGreen;
							color: @black; 
							&.lock:active, &.lock:visited, &.lock:hover{
								background-color: @lightGreen;
								cursor: no-drop;
								cursor: not-allowed;
							}
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
