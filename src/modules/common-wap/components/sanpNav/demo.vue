<template>
	<!-- 双向绑定值 -->
	<AFSnapNav class="m-sports" v-model="active">
		<AFSnapNavItem class="m-sports-item" v-if="test" name="cjx"><div>
			<span class="sport-text">Sports</span></div>
			</AFSnapNavItem>
		<AFSnapNavItem class="m-sports-item" name="tet"><div>
			<span class="sport-text">Live</span></div>
			</AFSnapNavItem>
		<AFSnapNavItem class="m-sports-item" name="222b"><div>
			<span class="sport-text">Virtual</span></div>
			</AFSnapNavItem>
		<AFSnapNavItem class="m-sports-item"><div>
			<span class="sport-text">Jackpot</span></div>
			</AFSnapNavItem>
	</AFSnapNav>
		
</template>

<script>
import 'components/sanpNav';

export default{
	components: {
	},
	data () {
		return {
			test: true,
			active: 1
		};
	},
	created () {
		window.test = this;
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
html,body{
	background-color: rgb(246, 246, 246);
}
</style>
