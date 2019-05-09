<template>
	<div class="download-app-main">
		<div class="top">
			<div class="top-wrapper">
				<div class="left-bg"></div>
				<div class="phone-carousel">
					<AfCarousel :itemsList="carouselList" :carouselOps="options">
					</AfCarousel>
				</div>
				<div class="download-group">
					<div class="download-slogan"></div>
					<div class="btn-download">
						<a target="_blank" :href="downloadAppUrl"></a>
						<div class="system-desc">{{androidVersion}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="introduction">
			<div class="into-wrapper">
				<div class="sports-img"></div>
			</div>
		</div>
		<div class="download-options">
			<div class="download-options-wrapper">
				<div class="download-title">
					<div class="title-wrapper">
						<div class="download-title-text">How do I download the SportyBet App?</div>
						<div class="line"></div>
					</div>
				</div>
				<div class="options">
					<div class="option-item">
						<div class="option-title">Opt-1   Scan QR Code</div>
						<div class="qrcode"><canvas id="canvas"></canvas></div>
						<div class="option-desc">
							<div>You can also download</div>
							<div>the SportyBet App via QR Code</div>
							<div class="qrcode-helper-link"><a @click="openQRCodeHelper()">How to scan QR Code? ></a></div>
						</div>
					</div>
					<div class="option-item">
						<div class="option-title">Opt-2   To my computer</div>
						<div class="btn-download">
							<a target="_blank" :href="downloadAppUrl"></a>
							<div class="system-desc"> {{androidVersion}}</div>
						</div>
						<div class="option-desc">
							<div>Click the download button to start</div>
							<div>downloading the SportyBet App.</div>
						</div>
					</div>
					<div class="option-item">
						<div class="option-title" style="margin-left:10px;">Opt-3    To my phone</div>
						<div class="">
							<div class="phone-tips">
								<div>Download address</div>
								<div class="short-link"><a :href="downloadShortUrl">{{downloadShortUrl}}</a></div>
							</div>
						</div>
						<div class="option-desc">
							<div>Input the address in your mobile browser</div>
							<div>to start download the SportyBet App</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { AfCarousel } from 'packages/carousel';
import { AfInput } from 'packages/input';
import 'components/dialog';
import { pagePath, domain, protocol } from 'config/pageConfig';
import QRCodeHelper from './pagelet/qrcodeHelper';

const QRCode = require('qrcode');

export default {
	components: {
		AfCarousel,
		AfInput,
		QRCodeHelper
	},
	data () {
		return {
			phone: 0,
			qrcodeImg: '',
			options: {
				indicators: true,
				interval: 5000
			},
			carouselList: [],
			downloadAppUrl: pagePath.downloadApp,
			downloadShortUrl: pagePath.downloadShort,
			androidVersion: 'For Android 4.0.3 or higher'
		};
	},
	created() {
		/* eslint-disable */
		this.carouselList = [
			{
				img: require('./image/carousel_01.jpg')
			},
			{
				img: require('./image/carousel_02.jpg')
			},
			{
				img: require('./image/carousel_03.jpg')
			}
		];
		/* eslint-enable */
		if (window.country && window.country === 'ng') {
			/* eslint-disable */
			this.carouselList = [
				{
					img: require('./image/carousel_ng_01.jpg')
				},
				{
					img: require('./image/carousel_ng_02.jpg')
				},
				{
					img: require('./image/carousel_ng_03.jpg')
				}
			];
			/* eslint-enable */
			this.downloadShortUrl = pagePath.downloadNgShort;
		}

		/* eslint-enable */
		if (window.country && window.country === 'gh') {
			/* eslint-disable */
			this.carouselList = [
				{
					img: require('./image/carousel_gh_01.jpg')
				},
				{
					img: require('./image/carousel_gh_02.jpg')
				},
				{
					img: require('./image/carousel_gh_03.jpg')
				}
			];
			/* eslint-enable */
			this.downloadShortUrl = pagePath.downloadGhShort;
		}
	},
	mounted() {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, `${protocol}//${domain}${this.downloadAppUrl}`, error => {
			if (error) {
				console.error(error);
			} else {
				canvas.style.width = '136px';
				canvas.style.height = '136px';
			}
		});
	},
	methods: {
		openQRCodeHelper() {
			this.$dialog({
				title: '<div class="dialog-title">How to scan QR Code?</div>',
				contentData: '',
				content: QRCodeHelper,
				layout: true,
				button: []
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/variable.less';
@import 'base/style/icon.less';
.top{
	width: 100%;
	height: 488px;
}
.top-wrapper{
	width: 1000px;
	height: 488px;
	margin:0 auto;
	position: relative;
	.left-bg,.download-group{
		float: left;
		margin-top: 53px;
	}
	.left-bg{
		width: 364px;
		height: 364px;
		overflow: hidden;
		background: url(./image/circle.png);
		background-size: 100% 364px;
	}
	.phone-carousel{
		position: absolute;
		top: 53px;
		left: 279px;
		width: 178px;
		height: 377px;
		background: url(./image/galaxy_phone.png);
		background-size: 100% 377px;
		#carousel {
			width: 164px;
			height: 338px;
			margin-top: 21px;
			margin-left: 7px;
			.carousel{
				height: 338px;
			}
			.carousel-indicators{
				bottom: -15%;
				width: 60%;
				margin-left: -30%;
				li{
					border-color: #696969;
					background-color: #696969;
					opacity: 0.23;
					margin-right: 10px;
					&.active{
						background-color: #696969;
						opacity: 1;
					}
				}
			}
		}
	}
	.download-group{
		margin-left: 155px;
	}
	.download-slogan{
		margin-top: 33px;
		width: 440px;
		height: 157px;
		background: url(./image/slogan.png) no-repeat;
		background-size: 100% 157px;
	}
	.btn-download{
		width: 335px;
		height: 137px;
		margin-left: 40px;
		margin-top: 13px;
		background: url(./image/btn_download_top.png) no-repeat;
		background-size: 100% 115px;
		a{
			margin-left: 25px;
			display: block;
			width: 287px;
			height: 66px;
			border-radius: 29.5px;
			border: 0;
		}
		&:before{
			content: "\0020";
			display: block;
			height: 18px;
			clear: both;
		}
	}
	.system-desc{
		margin: 24px auto 0;
		text-align: center;
		font-size: 15.3px;
		color: #7c7c7c;
	}
	&:after{
		content: "\0020";
		display: block;
		height: 0;
		clear: both;
	}
}
.introduction{
	height: 603px;
	background-color: #17bb1a;
	.into-wrapper{
		position: relative;
		padding-top: 53px;
		margin: 0 auto;
		width: 946px;
		height: 527px;
		background: url(./image/intro_bg.png) no-repeat;
		background-size: 792px 527px;
		background-position-y: 53px;
	}
	.sports-img{
		position: absolute;
		top: -22px;
		left: 40.8%;
		margin: 0 auto;
		width: 640px;
		height: 725px;
		background: url(./image/sportsman_with_phone.png);
		background-size: 100% 725px;
	}
	&:before{
		content: "\0020";
		display: block;
		height: 0;
		clear: both;
	}
}
.download-options{
	height: 602px;
	background-color: #434343;
	font-weight: normal;
	.download-options-wrapper{
		height: 602px;
		margin: 0 auto;
		background: url(./image/bottom_bg.png) center no-repeat;
		background-size: 100% 602px;
	}
	.download-title{
		margin: 0 auto;
		height: 174px;
		display: table;
		.title-wrapper{
			display: table-cell;
			vertical-align: bottom;
		}
		.download-title-text{
			height: 22px;
			font-size: 22px;
			line-height: 0.73;
			text-align: center;
			color: white;
		}
		.line{
			margin-top: 19px;
			opacity: 0.09;
			background-color: #000000;
			border-bottom: solid 6px #000000;
		}
	}
	.options{
		width: 898px;
		margin: 55px auto 0;
		.option-item{
			float: left;
			width: 33.33%;
			height: 229px;
			.option-title{
				margin-bottom: 26px;
				height: 18px;
				font-size: 18px;
				line-height: 0.89;
				color: white;
			}
			.qrcode{
				margin-left: 64px;
				width: 136px;
				height: 136px;
				margin: 0 auto;
			}
			.qrcode-helper-link{
				margin-top: 10px;
				&:hover{
					color: white;
				}
			}
			.btn-download{
				height: 136px;
				background: url(./image/btn_bottom.png) no-repeat;
				background-size: 281px 106px;
				a{
					display: block;
					margin-left: 23px;
					width: 234px;
					height: 57px;
					border-radius: 27.8px;
				}
				.system-desc{
					margin: 20px 0 0 49px;
					font-size: 15.3px;
					line-height: 1;
					text-align: left;
					color: white;
				}
				&:before{
					content: "\0020";
					display: block;
					height: 19px;
					clear: both;
				}
			}
			.phone-tips{
				margin-top: 20px;
				margin-left: 16px;
				height: 136px;
				font-size: 14px;
				line-height: 1.29;
				text-align: left;
				color: white;
				&:before{
					content: "\0020";
					display: block;
					height: 20px;
					clear: both;
				}
				.short-link{
					margin-top: 16px;
					font-size: 25px;
					& > a{
						color: white;
					}
				}
			}
			.option-desc{
				margin-top: 21px;
				font-size: 14px;
				line-height: 1.14;
				text-align: center;
				color: #a5a5a5;
			}
		}
		&:after{
			content: "\0020";
			display: block;
			height: 0;
			clear: both;
		}
	}
}
.es-dialog{
	.es-dialog-head {
		padding: 0 0 0 57px;
		color: #353a45;
		height: 45px;
		h1{
			line-height: 1;
			padding: 0;
			.dialog-title{
				font-size: 19px;
				height: 45px;
				line-height: 45px;
				font-weight: bold;
				border-bottom: solid 1px #eaecef;
			}
		}
		.es-dialog-close{
			top: 3px;
			right: 16px;
		}
	}
	.es-dialog-body{
		.es-dialog-main{
			background-color: #fafafa;
		}
	}
}
</style>
