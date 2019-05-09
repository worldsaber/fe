<#macro pageLoading>
	<style>
		#app {
			width: 100%;
			height: 500px;
			background: #EAECEF;

			display: table;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		#app .m-error-wrapper {
			display: table-cell;
			vertical-align: middle;
			text-align: center;
			width: 100px;
			height: 100px;
			animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;
		}

		@keyframes logoLoading {
			0% {
				transform: scale(1) translateZ(0);
			}

			37.5% {
				transform: scale(.8) translateZ(0);
			}

			62.5% {
				transform: scale(.6) translateZ(0);
			}

			87.5% {
				transform: scale(.5) translateZ(0);
			}

			100% {
				transform: scale(.4) translateZ(0);
			}
		}
	</style>
	<div class="m-error-wrapper">
		<img src="core/image/shortLogo.png" alt="">
	</div>
	
</#macro>
