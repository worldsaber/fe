<template>
	<div class="m-help-list">
		<a class="m-help-item m-call" :href="`tel:${phone}`" v-if="isShowTelephone">
			<i class="m-icon m-icon-phone"></i>
			<span>Call {{phone}}</span>
		</a>
		<a class="m-help-item m-help-link" :href="contactUs">
			<i class="m-icon m-icon-chat"></i>
			<span class="m-text">7/24 Online Help
				<div class="m-live-tag">
					<img src="../../../image/live-tag.svg" alt="live">
				</div>
			</span>
		</a>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';
import { phoneConfig } from '../config';

export default {
	name: 'HelpList',
	data() {
		return {
			contactUs: pagePath.contactUs,
			phone: phoneConfig[window.country]
		};
	},
	computed: {
		isShowTelephone() {
			return window.country !== 'gh';
		}
	},
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-help-list {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.m-help-item {
		flex: 0 0 50%;
		width: 50%;
		font-size: 14/@rem;
		line-height: 48/@rem;
		font-weight: 500;
		text-align: center;
		position: relative;

		&:after {
			content: '';
			width: 1px;
			height: 20/@rem;
			background: @fogGray;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -10/@rem;
		}

		&:last-child {
			&:after {
				display: none;
			}
		}

		&.m-call {
			color: #3656a3;
		}

		&.m-help-link {
			color: @green;

			.m-text {
				position: relative;
				padding-right: 22/@rem;
			}

			.m-live-tag {
				width: 21/@rem;
				position: absolute;
				right: 0;
				top: -2/@rem;

				img {
					vertical-align: top;
					width: 21/@rem;
				}
			}
		}

		.m-icon-phone {
			.m-icon-help-phone();

			&:before {
				color: #3656a3;
			}
		}

		.m-icon-chat {
			.m-icon-chatx();

			&:before {
				color: @green;
			}
		}

		.m-icon {
			&:before {
				font-size: 18/@rem;
				vertical-align: top;
			}
		}
	}
}
</style>
