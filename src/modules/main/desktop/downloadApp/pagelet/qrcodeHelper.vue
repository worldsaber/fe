<template>
	<div id="qrcode-helper">
		<div class="opt-facebook">
			<div>
				<span class="opt-title">Opt - 1</span>
				<span class="title-text">Facebook app</span>
			</div>
			<div style="margin-top: 18px;">
				<div class="helper-item">
					<div><img class="img-qrcode-reader" :src="require('../image/qrcode_reader.png')"></div>
					<div class="helper-text open-qrcode-text">Find and Open the QR Code reader in "HElP & SETTINGS".</div>
				</div>
				<div>
					<img class="img-arrow" :src="require('../image/arrow.png')">
				</div>
				<div class="helper-item" style="margin-left: 67px;">
					<div><img class="img-scan-qrcode" :src="require('../image/scan_qrcode.png')"></div>
					<div class="helper-text">Hold your device over the QR Code 
						on our website, and make sure that 
						the whole image is visiable within 
						the frame.
					</div>
				</div>
			</div>
		</div>
		<div class="dashed-line"></div>
		<div class="opt-other-scanner">
			<div>
				<span class="opt-title">Opt - 2</span>
				<span class="title-text">QR Code Scanner</span>
			</div>
			<div style="margin-top: 18px;">
				<div class="helper-item">
				<div>
					<img class="img-any-app" :src="require('../image/any_qrcode_app.png')"></div>
					<div class="helper-text" style="padding-left: 52px;">
						<div>Search "QR Code" in Play Store.</div>
						<div>Download any app and then scan</div>
						<div>the QR Code on our website.</div> 
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
	
		}
	};
</script>
<style lang="less">
	#qrcode-helper{
		background-color: #fafafa;
		padding: 0 43px;
		height: 400px;
		.opt-title{
			font-size: 19px;
			font-weight: bold;
			color: white;
			text-align: center;
			display: inline-block;
			width: 98px;
			height: 33px;
			line-height: 33px;
			border-radius: 16.5px;
			background-color: #25aa21;
		}
		.title-text{
			font-size: 17px;
			margin-left: 9px;
			font-weight: bold;
		}
		.opt-facebook{
			float: left;
			width: 486px;
			position: relative;
		}
		.img-qrcode-reader{
			height: 240px;
		}
		.img-arrow{
			position: absolute;
			top: 213px;
    		left: 208px;
			width: 47px;
		} 
		.img-scan-qrcode{
			height: 240px;
		}
		.pl{
			padding-left: 45px;
		}
		.img-any-app{
			height: 240px;
			.pl;
		}
		.helper-item{
			float: left;
			.helper-text{
				margin-top: 23px;
				font-size: 10px;
				line-height: 1.5;
				width: 190px;
				color: #858585;
			}
		}
		.open-qrcode-text{
			padding: 19px 0 0 20px;
		}
		.dashed-line{
			margin-top: 20px;
			float: left;
			width: 1px;
			height: 346px;
			border-left:1px dashed #c4c4c4; 
		}
		.opt-other-scanner{
			margin-left: 73px;
			float: left;
			width: 249px;
		}
		&:after{
			content: '';
			height: 0;
			display: block;
			clear: both;
		}
	}
</style>
