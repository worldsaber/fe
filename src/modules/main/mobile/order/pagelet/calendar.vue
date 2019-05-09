<template>
	<div class="container">
		<p class="close" @click="closeCalendar"></p>
		<p class="title">Choose Date Range</p>
		<div class="from-to-wrapper">
			<span class="from-to" style="width: 51%;display: inline-block;">From</span>
			<span class="from-to">To</span>
		</div>
		<!-- 日历部分 -->
		<div :class="{'increase':isOpenA||isOpenB}">
			<!-- 选择起始时间的日历 -->
			<div :class="['m-select-date','from',{'active':isOpenA}]">
				<!-- 日期显示框，默认显示dd/mm/yy，点击展开日历 -->
				<span :class="selectIndexClassA" @click="showOptionA">{{indexDateA}}</span>
				<div class="option" v-if="isOpenA">
					<div class="date-com">
						<!-- disabled：from以后的日期置灰不可点，to以前的置灰不可点；value为日期的值；selected事件：选定日期时，更新from -->
						<datepicker :disabled="disabledA" input-class ="date-input" :value="selectedA.date" calendar-class="date-size" v-on:selected="setDateA" :inline="true"/>
						<div class="date-bottom">
							<span @click="cancelA">CANCEL</span>
							<!-- 根据选择更新日历里的选定时间 -->
							<span :class="{unchange:!from}" @click="changeDateA">OK</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 选择结束时间的日历 -->
			<div :class="['m-select-date', 'to',{'active':isOpenB}]">
				<span :class="selectIndexClassB" @click="showOptionB">{{indexDateB}}</span>
				<div class="option right" v-if="isOpenB">
					<div class="date-com">
						<datepicker :disabled="disabledB" input-class ="date-input" :value="selectedB.date" calendar-class="date-size" v-on:selected="setDateB" :inline="true"/>
						<div class="date-bottom">
							<span @click="cancelB">CANCEL</span>
							<span :class="{unchange:!to}" @click="changeDateB">OK</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 开始时间未选择时，点击update提示 -->
		<p class="notice" :class="{'down':isOpenA||isOpenB}" v-if="showErrA">Please choose a start date.</p>
		<!-- 结束时间未选择时，点击update提示 -->
		<p class="notice" :class="{'down':isOpenA||isOpenB}" v-if="showErrB">Please choose an end date.</p>
		<!-- 清空日期、时间和lastOrderNo，请求列表 -->
		<div class="update" @click="getCalendarList">Update</div>
		<!-- 清空日期、时间、from、to、和lastOrderNo，请求列表 -->
		<div class="back" @click="reset">Back to All Dates</div>
		<div class="view-more" v-if="!choosedDate && !isHistory && (settleType !== 'Unsettled')">
			<p @click="to6MonAgo">View tickets from 6 months ago<i class="icon"></i></p>
		</div>
	</div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/order/mutationTypes';
import { formatDateYear2 } from 'store/order/commonFun';
import Datepicker from 'vuejs-datepicker';
import dateFormat from 'kernel/js/dateFormat';
import 'components/dialog';

export default {
	name: 'selectDate',
	components: {
		Datepicker,
	},
	props: ['viewMore', 'choosedDate', 'settleType'],
	data () {
		return {
			isOpenA: false, // 判断下拉日历的开关
			isOpenB: false,
			disabledA: { // 日历置灰区间
				from: new Date(),
				to: new Date(new Date().setDate(new Date().getDate() - 180)) // 180以前日期置灰不可选
			},
			disabledB: {
				to: new Date(new Date().setDate(new Date().getDate() - 180)),
				from: new Date(),
			},
			selectedA: { // 高亮的日期，初始为当前日期前一天
				date: (() => {
					const d = 0;
					// const d = new Date();
					// d.setDate(d.getDate() - 1);
					return d;
				})()
			},
			selectedB: {
				date: (() => {
					const d = 0;
					// const d = new Date();
					// d.setDate(d.getDate() - 1);
					return d;
				})()
			},
			showErrA: false, // 错误提示开关
			showErrB: false
		};
	},
	computed: {
		...mapState('order', [
			'from',
			'to',
			'flagForDate',
			'flagForYear',
			'isHistory'
		]),
		indexDateA () { // 日历框里的日期，随from的变化而变化
			return this.from ? dateFormat.format(this.from, 'DD/MM/YYYY') : 'dd/mm/yy';
		},
		indexDateB () {
			return this.to ? dateFormat.format(this.to, 'DD/MM/YYYY') : 'dd/mm/yy';
		},
		// 高亮的样式
		selectIndexClassA () {
			return {
				'select-index': true,
				empty: !this.indexDateA,
			};
		},
		selectIndexClassB () {
			return {
				'select-index': true,
				empty: !this.indexDateB,
			};
		},
	},
	methods: {
		to6MonAgo() {
			this.viewMore();
			this.closeCalendar();
		},
		// 在父组件上关闭日历选择页
		closeCalendar () {
			this.isOpenA = false;
			this.isOpenB = false;
			this.showErrA = false;
			this.showErrB = false;
			this.$emit('closeCalendar');
		},
		reset () {
			this.selectedA.date = 0;
			this.selectedB.date = 0;
			this.disabledA.to = this.disabledB = new Date(new Date().setDate(new Date().getDate() - 180));
			this.disabledA.from = this.disabledB.from = new Date();
			this.clearFrom();
			this.clearTo();
			this.clearFlag4Date();
			this.clearFlag4Year();
			this.changeLastOrderNo('');
			this.$emit('reset');
			this.closeCalendar();
		},
		...mapMutations('order', {
			updateFrom: mutationTypes.UPDATEFROM,
			clearFrom: mutationTypes.CLEARFROM,
			updateTo: mutationTypes.UPDATETO,
			clearTo: mutationTypes.CLEARTO,
			clearFlag4Date: mutationTypes.CLEARFLAGFORDATE,
			clearFlag4Year: mutationTypes.CLEARFLAGFORYEAR,
			changeLastOrderNo: mutationTypes.UPDATELASTORDERNO,
		}),
		getCalendarList () {
			if (!this.from) {
				this.showErrB = false;
				this.showErrA = true;
			} else if (!this.to) {
				this.showErrA = false;
				this.showErrB = true;
			} else {
				this.showErrA = false;
				this.showErrB = false;
				this.clearFlag4Date();
				this.clearFlag4Year();
				this.changeLastOrderNo('');
				this.$emit('fetch', {
					from: formatDateYear2(this.from),
					to: formatDateYear2(this.to)
				});
			}
		},
		showA () {
			// 两个日历不能同时打开
			this.isOpenA = true;
			this.isOpenB = false;
			document.documentElement.style = { overflow: 'hidden' };
			document.body.style = { overflow: 'hidden' };
		},
		closeA () {
			this.isOpenA = false;
			document.body.style = { overflow: 'auto' };
		},
		cancelA() {
			this.closeA();
			this.clearFrom();
		},
		showB () {
			this.isOpenB = true;
			this.isOpenA = false;
			document.documentElement.style = { overflow: 'hidden' };
			document.body.style = { overflow: 'hidden' };
		},
		closeB () {
			this.isOpenB = false;
			document.body.style = { overflow: 'auto' };
		},
		cancelB() {
			this.closeB();
			this.clearTo();
		},
		// 点击选择日期时，错误提示消失
		setDateA (val) {
			this.showErrA = false;
			this.updateFrom(val);
		},
		setDateB (val) {
			this.showErrB = false;
			this.updateTo(val);
		},
		// 点击OK时调用
		changeDateA (val) {
			if (this.from) {
				// 更新起始日历里的时间
				Object.assign(this.selectedA, { date: this.from });
				// 终止日历里，起始时间以前的置灰
				this.disabledB.to = this.from;
				this.closeA();
			} else {
				this.closeA();
				return false;
			}
		},
		changeDateB (val) {
			if (this.to) {
				Object.assign(this.selectedB, { date: this.to });
				this.disabledA.from = new Date(this.to + 1);
				this.closeB();
			} else {
				this.closeB();
				return false;
			}
		},
		showOptionA () {
			if (this.isOpenA) {
				return this.closeA();
			}
			this.showA();
		},
		showOptionB () {
			if (this.isOpenB) {
				return this.closeB();
			}
			this.showB();
		},
	},
};
</script>
<style lang="less">
@import "~base/styles/mixin.less";
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";

.container {
  padding: 0 16 / @rem;
  .increase {
    height: 210 / @rem;
  }
  .down {
    position: relative;
    top: 114 / @rem;
  }
  .close {
    color: @dark;
    position: absolute;
    right: 14 / @rem;
    top: 50 / @rem;
    .m-icon-close();

    &:before {
      font-size: 12px;
      line-height: 1;
    }
  }
  .right {
    position: relative;
    right: 107%;
    .date-bottom {
      position: relative;
      left: 80 / @rem;
    }
  }
  .title {
    padding-top: 23 / @rem;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .from-to-wrapper {
    margin-top: 28 / @rem;
    margin-bottom: 8 / @rem;
  }
  .from-to {
    font-size: 14 / @rem;
  }
  .to {
    position: relative;
    left: 8 / @rem;
  }
  .notice {
    color: #e41827;
  }
  .update {
    margin-top: 125 / @rem;
    height: 48 / @rem;
    line-height: 48 / @rem;
    background-color: #0d9737;
    font-size: 16 / @rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }
  .back {
    height: 48 / @rem;
    line-height: 48 / @rem;
    margin-top: 13 / @rem;
    border-radius: 2px;
    border: solid 1px #0d9737;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #0d9737;
  }
  .view-more {
		margin-top: 20/@rem;
		text-align: center;
		p {
			padding-bottom: 15/@rem;
			color: @linkBlue;
			.icon {
				.m-icon-arrow--right();
				&:before {
					font-size: 12/@rem;
					margin-left:5/@rem;
				}
			}
		}
  	}

  .m-select-date {
    .m-icon-arrow-down2();
    &::before {
      font-size: 8 / @rem;
      padding-right: 15 / @rem;
      position: relative;
      left: 85%;
      top: -20 / @rem;
      color: #0d9737;
    }
    height: 48 / @rem;
    width: 48%;
    float: left;
    border: solid 1px #dcdee5;
    border-radius: 2px;
    margin-bottom: 11 / @rem;
    .select-index,
    .subtract-date,
    .add-date {
      width: 111 / @rem;
      display: inline-block;
      font-size: 14 / @rem;
      line-height: 48 / @rem;
      cursor: pointer;
      .ellipsis();
      &.empty {
        opacity: 0.4;
      }
      &.disable {
        background-color: @fogGray;
        color: fade(@darkGray, 50%);
        opacity: 1;
      }
    }
    .subtract-date,
    .add-date {
      display: inline-block;
      width: 20%;
      margin: 0;
      .m-icon-back();
    }
    .add-date {
      .m-icon-arrow--right();
    }
    .option {
      .date-com {
        padding-top: 10 / @rem;
        background-color: @white;
        border-radius: 2px;
        .date-bottom {
          height: 52 / @rem;
          position: relative;
          left: 50%;
          span {
            padding: 0 9 / @rem;
            margin-right: 10px;
            display: inline-block;
            color: @green;
            line-height: 40 / @rem;
            font-size: 14 / @rem;
            &.unchange {
              color: @midGray;
            }
          }
        }
      }
      .date-size.vdp-datepicker__calendar {
        font-size: 12 / @rem;
        width: 208%;
        border-color: transparent;
        margin: 0 auto;
        .cell {
          height: 25 / @rem;
          line-height: 25 / @rem;
          margin: 0;
          &.day-header {
            background-color: @fogGray;
          }
          &.day {
            padding: 0;
          }

          border-radius: 2px;
          &:not(.blank):not(.disabled) {
            &.day,
            &.month,
            &.year {
              &:hover {
                border-color: @green;
              }
            }
          }

          &.selected,
          &.selected.highlighted,
          &.selected:hover {
            background: @green;
            color: @white;
          }
        }
      }
    }
  }
  .active {
    border: 1px solid #0d9737;
  }
}

</style>
