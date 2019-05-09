<template>
  <div class="m-ac-form-wrap verified-email-note-wrapper">
		<topNavBar :backClick="backHandler" />
		<p class="note">Verified Email:</p>
		<p class="email">{{email}}</p>
		<p class="note">Note:
			<span>Once your email address is verified, it can’t be changed. Please call our Customer Service  <a :href="`tel:${tel}`">{{tel}}</a> to make changes.</span>
		</p>
  </div>
</template>
<script>
import topNavBar from 'components/navbar';

const telMap = {
	ke: '0207640825',
	ng: '07008888888',
	gh: '0242426200'
};
export default {
	components: {
		topNavBar
	},
	data() {
		return {
			email: this.sendData.value,
			tel: telMap[window.country]
		};
	},
	props: ['sendData'],
	methods: {
		backHandler () {
			this.$emit('backEvent', -1);
		},
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
	.verified-email-note-wrapper {
		background: @fogGray !important;
		.note {
			margin-top: 26/@rem;
			margin-bottom: 13/@rem;
			padding-left: 16/@rem;
			padding-right: 16/@rem;
			color: @darkGray;
			span {
				display: block;
				a {
					text-decoration: none;
					color: @linkBlue;
				}
			}
		}
		.email {
			margin-top: 3/@rem;
			margin-bottom: 36/@rem;
			background: @white;
			height: 48/@rem;
			line-height: 48/@rem;
			padding-left: 16/@rem;
			color: @darker;
			font-size: 14/@rem;
		}
	}
</style>


