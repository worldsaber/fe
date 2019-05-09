<template>
	<div :class="['m-gift-item', ...item.cls]">
		<div class="m-gift-upper">
			<div class="m-gift-left">
				<div class="m-gift-condition" v-if="item.condition">{{item.condition}}</div>
				<div class="m-gift-amount"><i class="m-gift-unit">{{item.showCurrency}}</i>{{item.amount}}{{item.suffix}}</div>
				<div class="m-gift-origin" v-if="item.origin">{{item.origin}}</div>
				<div class="m-gift-expire">{{item.expire}}</div>
			</div>
			<div class="m-gift-right">
				<div class="m-gift-label" v-if="item.label">{{item.label}}</div>
				<a class="m-gift-use" v-if="item.isUsable" :href="item.use" @click="onClickUse">Use</a>
			</div>
		</div>
		<div class="m-gift-lower">
			<div class="m-gift-kind"> {{item.kind}} <span class="m-gift-exclusive">{{item.exclusive}}</span> </div>
			<div class="m-gift-desc-wrap">
				<div :class="['m-gift-title']">
					{{item.title}}
					<span v-if="item.desc" class="m-gift-btn-more" @click="onToggleMore">more
						<i class="m-gift-arrow-up" v-if="showDesc"></i>
						<i class="m-gift-arrow-down" v-else></i>
					</span>
				</div>
				<div class="m-gift-desc" v-show="showDesc" v-html="desc"></div>
			</div>
		</div>
	</div>
</template>
<script>
import { LS } from 'storage';
import dialog from 'components/dialog';
import PopUse from './pop-use';

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showDesc: this.item.showDesc,
			desc: this.item.desc.replace(/\\n|\\r|\u000A|\\t/g, '<br>'),
		};
	},
	methods: {
		onToggleMore() {
			this.showDesc = !this.showDesc;
		},
		onClickUse(evt) {
			// 判断是否是第一次
			const key = 'gift-pop-use';
			const value = LS.get(key);
			if (!value) {
				evt.preventDefault();
				dialog({
					title: 'How to Use Gifts from Betslip',
					'class': 'm-gift-pop-dialog',
					contentData: {
						useUrl: this.item.use
					},
					content: PopUse,
					button: []
				});
				LS.set(key, true);
			}
		}
	}
};
</script>
<style lang="less">
 @import 'base/styles/variable.less';
 @import 'base/styles/icon.less';

 @yellowBg: #FAAE11;
.m-gift-item{
	margin-bottom: 12/@rem;
	padding-bottom: 2/@rem;
	background: @yellowBg;
	border-radius: 4/@rem;
	color: @white;
	position: relative;
}
// 满减
.m-gift-item-discount{
	.m-gift-expire{
		color: #a94700;
	}
	.m-gift-use{
		color: #faae11;
	}
	.m-gift-kind{
		color: #a94700;
	}
	.m-gift-exclusive{
		color: rgba(169, 71, 0, 0.8);
	}
}
// 直减
.m-gift-item-lapse{
	background: @green;
	.m-gift-expire{
		color: #004603;
	}
	.m-gift-use{
		color: #0d9737;
	}
	.m-gift-kind{
		color: #004603;
	}
	.m-gift-exclusive{
		color: rgba(0, 70, 3, 0.8);
	}
	.m-gift-lower{
		&::before{
			border-right-color: #0d9737;
			border-bottom-color: #0d9737;
		}
		&::after{
			border-top-color: #0d9737;
			border-left-color: #0d9737;
		}
	}
}
.m-gift-item-gray{
	background: @darkGray;
	.m-gift-kind{
		color: @darkGray;
	}
	.m-gift-lower{
		&::before{
			border-right-color: @darkGray;
			border-bottom-color: @darkGray;
		}
		&::after{
			border-top-color: @darkGray;
			border-left-color: @darkGray;
		}
	}
}
.m-gift-upper{
	display: flex;
	padding: 8/@rem 14/@rem;
}
.m-gift-left{
	position: relative;
	flex-grow: 1;
	height: 68/@rem;
}
.m-gift-condition{
	font-size: 12/@rem;
	color: @white;
}
.m-gift-amount{
	display: flex;
	align-items: flex-start;
	line-height: 1;
	box-sizing: border-box;
	font-size: 24/@rem;
	margin: 2px 0;
}
.m-gift-unit{
	font-size: 14/@rem;
	margin-right: 8/@rem;
	margin-top: 3/@rem;
	line-height: 1;
}
.m-gift-origin{
	font-size: 12/@rem;
	color: #FFF;
}
.m-gift-expire{
	position: absolute;
	bottom: 0;
}
.m-gift-right{
	position: relative;
}
.m-gift-use{
	position: absolute;
	height: 30/@rem;
	width: 72/@rem;
	bottom: 5/@rem;
	right: 0;
	background-color: #FFF;
	border-radius: 2/@rem;
	font-size: 14/@rem;
	line-height: 30/@rem;
	font-weight: bold;
	text-align: center;
	text-decoration: none;
}
.m-gift-label{
	height: 18/@rem;
	padding: 0 10/@rem;
	font-size: 12/@rem;
	line-height: 18/@rem;
	color: rgb(247, 247, 247);
	text-align: center;
	background-color: rgba(27, 30, 37, 0.12);
	border-radius: 10/@rem;
}
.m-gift-lower{
	background-color: #f2f3f5;
	margin: 0 2/@rem;
	padding: 10/@rem 14/@rem;
	position: relative;
	&::before,
	&::after{
		content: '';
		width: 20/@rem;
		height: 20/@rem;
		background: @white;
		border-radius: 20/@rem;
		border: 2/@rem solid #faae11;
		position: absolute;
		top: -10/@rem;
	}
	&::before{
		left: -14/@rem;
		border-left-color: transparent;
		border-top-color: transparent;
		transform: rotate(-45deg);
	}
	&::after{
		right: -14/@rem;
		border-right-color: transparent;
		border-bottom-color: transparent;
		transform: rotate(-45deg);
	}
}
.m-gift-kind{
	font-size: 12/@rem;
}
.m-gift-exclusive{
	font-size: 10/@rem;
}
.m-gift-title{
	position: relative;
	color: #9ca0ab;
	font-size: 12/@rem;
	padding: 5/@rem 70/@rem 0 0;
	line-height: 14/@rem;
}
.m-gifit-title-ellipsis{
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.m-gift-desc{
	margin-top: 5/@rem;
	color: #9ca0ab;
	font-size: 10/@rem;
	line-height: 14/@rem;
}
.m-gift-btn-more{
	position: absolute;
	top: 50%;
	margin-top: -5/@rem;
	right: 0;
	color: #3656a3;
	font-size: 12/@rem;
}
.m-gift-arrow-up{
	line-height: 1;
	margin-top: 5/@rem;
	.m-icon-arrow--up();
	&:before{
		font-size: 12/@rem;
	}
}
.m-gift-arrow-down{
	line-height: 1;
	margin-top: 5/@rem;
	.m-icon-arrow--down();
	&:before{
		font-size: 12/@rem;
	}
}
</style>

