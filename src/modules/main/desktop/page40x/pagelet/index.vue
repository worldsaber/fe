<template>
<div class="error-page-container">
	<div class="page-head">
		<div class="error-title-container">
			<div class="error-title-1">40X</div>
			<span class="error-title-2">ERROR</span>
		</div>
		<div class="img-container"><img src="../img/PC_400-compressor.png"></div>
	</div>
	<div class="page-body">
		<div class="error-message-title">OOPS...</div>
		<div class="error-message">The page and ball you're looking for doesn't exsit. Please go back to the home page and enjoy your matches, we are waiting for you there!</div>
		<af-Button class="go-back" @click="goBack">Go Back</af-Button>
	</div>
</div>
</template>

<script>
export default {
	data() {
		return {

		};
	},
	methods: {
		goBack() {
			history.go(-1);
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.error-page-container {
    width: 100%;
    height: 584px;
    background-color: @white;
    margin-top: 10px;
    margin-bottom: 56px;

    .page-head {
        padding-top: 84px;
        font-size: 0;

        .error-title-container {
            vertical-align: top;
            display: inline-block;
            width: 214px;
            margin-left: 123px;
			margin-right: 93px;
			position: relative;
            .error-title-1 {
                font-size: 120px;
                font-weight: bold;
                text-align: center;
                color: @grayTextColor;
                line-height: 140px;
            }

            .error-title-2 {
                font-size: 28px;
                font-weight: 500;
                text-align: center;
                color: @grayTextColor;
				position: absolute;
				right: 0;
				top: 121px;
            }
        }

        .img-container {
            vertical-align: top;
            display: inline-block;
            width: 470px;

            img {
                height: 100%;
                width: 100%;
            }
        }
    }

    .page-body {
        margin: 75px 114px 0 125px;

        .error-message-title {
            font-size: 36px;
            font-weight: bold;
            text-align: left;
            color: @dark;
        }

        .error-message {
            margin-top: 17px;
            font-size: 16px;
            line-height: 1.5;
            text-align: left;
            color: @dark;
        }

        .go-back {
            float: right;
            margin-right: 6px;
            width: 210px;
            height: 38px;
            background-color: @white;
            border-radius: 2px;
            border: solid 1px @green;
            color: @green;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
        }
    }
}
</style>
