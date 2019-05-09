<template>
	<div class="first-deposit-entrance">
		<a class="download entrance-btn" :href="downloadUrl">
			<span class="entrance-down btn-icon"></span>
			<span>
				DOWNLOAD APP
			</span>
		</a>
		<a class="homepage entrance-btn" :href="homeUrl">
			<span class="entrance-logo btn-icon"></span>
			<span>
				SPORTYBET WEBSITE
			</span></a>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		return {
			downloadUrl: URL.addPara(`${pagePath.reDownloadApp}?channel=wap`, {
				source: 'first_deposit'
			}),
			homeUrl: pagePath.home,
		};
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.first-deposit-entrance{
	margin: 24/@rem 12/@rem;
	display: flex;
	height: 48/@rem;
	// line-height: 48/@rem;
	.entrance-btn{
		display: flex;
		align-items: center;
		flex: 1;
		color: #FFF;
		border-radius: 2px;
		border: solid 1px #FFF;
		background-color: rgba(0, 0, 0, 0.4);
		margin: 0 4/@rem;
	}
	.entrance-down{
		.m-icon-down2();
	}
	.entrance-logo{
		.m-icon-logo();
	}
	.btn-icon{
		margin: 0 10/@rem;
		font-size: 12/@rem;
		font-weight: bold;
		&::before{
			font-size: 24/@rem;
		}
	}
}
</style>
