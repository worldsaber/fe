<template>
	<div class="testimonial-words-wrap">
		<div class="test-words">{{words}}</div>
		<div class="test-author">
			<img class="test-author-profile" :src="author.profile" />
			<span class="test-author-name">{{author.name}}</span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		words: String,
		author: Object
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.testimonial-words-wrap{
	color: #1b1e25;
	.test-words{
		font-size: 18/@rem;
		line-height: 1.2;
		min-height: 100/@rem;
	}
	.test-author{
		display: flex;
		align-items: center;
		margin-top: 10/@rem;
	}
	.test-author-profile{
		height: 38/@rem;
		width: 38/@rem;
		border-radius: 20/@rem;
	}
	.test-author-name{
		font-size: 12/@rem;
		margin-left: 10/@rem;
	}
}
</style>

