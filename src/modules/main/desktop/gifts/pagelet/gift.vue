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
				<a class="m-gift-use" v-if="item.isUsable" :href="item.use">Use</a>
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
				<div class="m-gift-desc" v-show="showDesc">{{item.desc}}</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showDesc: this.item.showDesc
		};
	},
	methods: {
		onToggleMore() {
			this.showDesc = !this.showDesc;
		}
	}
};
</script>
<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';

@yellowBg: #FAAE11;

.m-gift-item{
	margin-bottom: 12px;
	padding-bottom: 2px;
	background: @yellowBg;
	border-radius: 4px;
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
	padding: 10px 14px;
}
.m-gift-left{
	position: relative;
	flex-grow: 1;
	height: 68px;
}
.m-gift-condition{
	font-size: 12px;
	color: @white;
}
.m-gift-amount{
	display: flex;
	align-items: flex-start;
	line-height: 1;
	box-sizing: border-box;
	font-size: 24px;
	margin: 2px 0;
}
.m-gift-unit{
	font-size: 14px;
	margin-right: 8px;
	margin-top: 3px;
	line-height: 1;
}
.m-gift-origin{
	font-size: 12px;
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
	height: 30px;
	width: 72px;
	bottom: 5px;
	right: 0;
	background-color: #FFF;
	border-radius: 2px;
	font-size: 14px;
	line-height: 30px;
	font-weight: bold;
	text-align: center;
	text-decoration: none;
}
.m-gift-label{
	height: 18px;
	padding: 0 10px;
	font-size: 12px;
	line-height: 18px;
	color: rgb(247, 247, 247);
	text-align: center;
	background-color: rgba(27, 30, 37, 0.12);
	border-radius: 10px;
}
.m-gift-lower{
	background-color: #f2f3f5;
	margin: 0 2px;
	padding: 10px 14px;
	position: relative;
	&::before,
	&::after{
		content: '';
		width: 20px;
		height: 20px;
		background: @white;
		border-radius: 20px;
		border: 2px solid #faae11;
		position: absolute;
		top: -10px;
	}
	&::before{
		left: -14px;
		border-left-color: transparent;
		border-top-color: transparent;
		transform: rotate(-45deg);
	}
	&::after{
		right: -14px;
		border-right-color: transparent;
		border-bottom-color: transparent;
		transform: rotate(-45deg);
	}
}
.m-gift-kind{
	font-size: 12px;
}
.m-gift-exclusive{
	font-size: 10px;
}
.m-gift-title{
	position: relative;
	color: #9ca0ab;
	font-size: 12px;
	padding: 5px 70px 0 0;
}
.m-gifit-title-ellipsis{
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.m-gift-desc{
	color: #9ca0ab;
	font-size: 10px;
	margin-top: 5px;
}
.m-gift-btn-more{
	position: absolute;
	top: 50%;
	margin-top: -9px;
	right: 0;
	color: #3656a3;
	cursor: pointer;
	font-size: 12px;
}
.m-gift-arrow-up{
	line-height: 1;
	margin-top: 5px;
	.m-icon-arrow--up();
	&:before{
		font-size: 12px;
	}
}
.m-gift-arrow-down{
	line-height: 1;
	margin-top: 5px;
	.m-icon-arrow--down();
	&:before{
		font-size: 12px;
	}
}
</style>

