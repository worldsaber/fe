<template>
	<div class="m-emoji-list">
		<Carousel :indicators="true" :interval="0">
			<CarouselItem v-for="(list, i) in emojiList" :key="i">
				<div class="m-emoji-tab">
					<template v-for="(item, index) in list">
						<div class="m-icon-wrap">
							<i
								:key="`${i}-${index}`"
								class="m-emoji-icon"
								@click="handleClick(item)">
								{{item}}
							</i>
						</div>
					</template>
					<div class="m-icon-wrap m-backspace-btn-wrap">
						<i class="m-emoji-icon m-backspace-btn" @click="handleBackspace"></i>
					</div>
				</div>
			</CarouselItem>
		</Carousel>
	</div>
</template>

<script>
import Carousel from 'packages/carousel/carousel.vue';
import CarouselItem from 'packages/carousel/items.vue';
import emoji from './emoji.js';

export default {
	name: 'Emoji',
	components: {
		Carousel,
		CarouselItem
	},
	computed: {
		emojiList() {
			// 每行8个，共四行，最后一个为删除按钮
			const rowCount = 31;
			const max = Math.ceil(emoji.list.length / rowCount);
			const result = [];
			for (let i = 0; i < max; i++) {
				const startIndex = i * rowCount;
				result.push(emoji.list.slice(startIndex, startIndex + rowCount));
			}
			return result;
		}
	},
	methods: {
		handleClick(value) {
			this.$emit('click', value);
		},
		handleBackspace() {
			this.$emit('delete');
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-emoji-list {
	padding: 8/@rem 8/@rem 0;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-y: auto;
	background: #f2f3f5;

	.m-emoji-tab {
		overflow: hidden;
	}

	.m-icon-wrap {
		width: 12.5%;
		float: left;
		margin: 6/@rem 0;
	}

	.m-emoji-icon {
		display: block;
		margin: 4/@rem;
		text-align: center;
		box-sizing: border-box;
		font-size: 24/@rem;
		line-height: 1;
	}

	.carousel,
	.carousel-inner {
		height: 204/@rem;
	}

	.carousel {
		.carousel-indicators {
			li {
				background: #dcdee5;
				border: 0;
				width: 8/@rem;
				height: 8/@rem;
				min-width: 8/@rem;
				min-height: 8/@rem;

				&.active {
					background: #9ca0ab;
				}
			}
		}
	}

	.m-backspace-btn-wrap {
		position: absolute;
		right: 0;
		bottom: 28/@rem;
	}

	.m-backspace-btn {
		.m-icon-backspace();

		&:before {
			font-size: 24/@rem;
			line-height: 1;
			color: #9ca0ab;
		}
	}
}
</style>
