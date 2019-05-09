<template>
<div class="error-page-container">
	<div class="error-50x">
		<div class="img-container">
			<img class="error-img" :src="require('../img/wap_500.png')">
		</div>
		<div class="error-title">50X ERROR</div>
		<div class="error-message">
			<div class="message-head">Uh...</div>
			<div class="message-body">Something went wrong and ball is deflated. Developers have been informed about this and will correct the issue. Please try again. Thank you!</div>
		</div>
		<div class="go-home-container">
			<afButton class="go-home" @click="goHome">Go Back</afButton>
		</div>
	</div>
</div>
</template>

<script>
import afButton from 'packages/button/index';

export default {
	data() {
		return {

		};
	},
	components: {
		afButton
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	methods: {
		goHome() {
			// location.href = '/ke/m';
			history.go(-1);
		}
	}
};
</script>

<style lang='less'>
@import '~base/styles/variable.less';

.error-page-container {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .error-50x {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        -webkit-box-orient: vertical;

        .img-container {
            margin: 38/@rem 36/@rem 6.9/@rem 31/@rem;
            height: 100.1/@rem;
            flex: 0 0 auto;
            .error-img {
                width: 100%;
                height: 100%;
            }
        }

        .error-title {
            height: 21/@rem;
            font-size: 18/@rem;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: center;
            color: @grayTextColor;
            flex: 0 0 auto;
        }

        .error-message {
            font-size: 22/@rem;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: left;
            color: @dark;
            margin: 16/@rem 48/@rem 0;
            flex: 1 1 auto;
            .message-body {
                font-size: 14/@rem;
                font-weight: normal;
                line-height: 1.43;
            }
        }

        .go-home-container {
            height: 103/@rem;
            flex: 0 0 auto;
			padding-left: 50/@rem;
			padding-right: 50/@rem;
			width: 100%;
			box-sizing: border-box;
            .go-home {
                font-size: 16/@rem;
                font-weight: bold;
                text-align: center;
                color: @green;
                width: 100%;
                height: 48/@rem;
				background-color: @white;
				border-color: @green;
            }
        }
    }
}
</style>
