<template lang="html">
	<ul class="m-types">
		<li
			v-for="(item, key) in cardList"
			:key="key"
			class="i-card-item"
		>
			<img :src="item" alt="" />
		</li>
    </ul>
</template>

<script>
export default {
	props: {
		cardTypes: {
			type: [Object, Array],
			required: true
		}
	},
	computed: {
		cardList() {
			return this.cardTypes;
		}
	}
};
</script>

<style lang="less">
@import '../style/cards.less';
</style>
