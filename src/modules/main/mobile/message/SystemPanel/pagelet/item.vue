<template>
	<div class="m-system-message-item" @click="handleClick">
		<div class="m-item-header">
			<div class="m-item-title">
				<img v-if="item.iconUrl" class="m-icon" :src="item.iconUrl" alt="">
				<span>{{item.title}}</span>
			</div>

			<div class="m-item-time">{{showTime}}</div>
		</div>

		<div class="m-item-main">
			<p>{{item.message}}</p>

			<div class="m-show-imgs" v-if="item.imgUrl">
				<img :src="item.imgUrl" alt="">
			</div>
		</div>

		<div class="m-item-footer" v-if="item.url">
			<a class="m-check-btn" :href="item.url">Check details <i class="m-icon-arrow"></i></a>
		</div>
	</div>
</template>

<script>
import { formatCommentDate } from 'utils/comment';

export default {
	name: 'SystemItem',
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	computed: {
		showTime() {
			return formatCommentDate(this.item.createTime);
		}
	},
	methods: {
		handleClick() {
			if (this.item.url) {
				window.location.href = URL.addPara(this.item.url, {
					source: 'message'
				});
			}
		}
	}
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-system-message-item {
	padding: 22/@rem 16/@rem 19/@rem;
	border-bottom: 1px solid @fogGrayBorder;

	.m-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-item-title {
			font-size: 16/@rem;
			font-weight: bold;
			color: @dark;

			.m-icon {
				width: 20/@rem;
			}
		}

		.m-item-time {
			font-size: 12/@rem;
			line-height: 1;
			color: @darkGray;
		}
	}

	.m-item-main {

		p {
			margin: 8/@rem 0;
			font-size: 14/@rem;
			line-height: 1.29;
			color: @darker;
		}

		.m-show-imgs {
			width: 100%;
			text-align: center;

			img {
				max-width: 100%;
				vertical-align: top;
			}
		}
	}

	.m-item-footer {
		overflow: hidden;
		margin-top: 8/@rem;

		.m-check-btn {
			float: right;

			font-size: 12/@rem;
			line-height: 1;
			color: @linkBlue;

			.m-icon-arrow {
				.m-icon-arrow--right();

				&:before {
					font-size: 10/@rem;
				}
			}
		}
	}
}
</style>

