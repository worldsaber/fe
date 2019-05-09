<template>
	<Sms @back="jumpToIndex" @jumpTo="jumpToIndex" @success="onSuccess"></Sms>
</template>

<script>
import Sms from 'components/register/pagelet/sms';

export default {
	name: 'SmsResult',
	components: {
		Sms
	},
	methods: {
		jumpToIndex () {
			this.$router.push({ name: 'collectGifts' });
		},
		onSuccess () {
			window.loginStatus = true;
			this.$router.push({ name: 'collectGifts' });
		}
	}
};
</script>

<style lang="less">
#pageLoading {
	display: none!important;
}
</style>

