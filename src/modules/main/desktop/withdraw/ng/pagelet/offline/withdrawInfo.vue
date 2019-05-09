<template>
<div class="withdraw-info-wrapper">
	<div class="icon-wrapper">
		<i class="m-icon-close" data-action="close" data-ret="close"></i>
	</div>
	<ul>
		<li>
			<span>Withdrawal Amount ({{currency}})</span>
			<span>{{contentData.withdrawAmount}}</span>
		</li>
		<li>
			<span>Commission to Partner</span>
			<span>{{contentData.fee}}</span>
		</li>
		<li>
			<span>Remaining Amount</span>
			<span>{{contentData.remainingAmount}}</span>
		</li>
		<li>
			<span>Partner Code</span>
			<span>{{contentData.partnerCode}}</span>
		</li>
		<li>
			<span :class="{'noInfo':!contentData.info}">Info</span>
			<span>{{contentData.info}}</span>
		</li>
	</ul>
  </div>
</template>

<script>
export default {
	data () {
		return {
			currency: window.currency || 'NGN',
		};
	},
};
</script>

<style lang="less">
@import "base/style/icon.less";

.withdraw-info-wrapper {
  color: #353a45;
  padding: 0 15px;
  ul {
    margin-top: 21px;
    background: #f8f8f8;
    li {
      display: flex;
	  justify-content: space-between;
	  margin-bottom: 10px;
      span:first-child {
        color: #9ca0ab;
      }
    }
    li:first-child {
	  font-size: 14px;
      span:first-child {
        color: #353a45;
      }
      span:last-child {
        font-size: 18px;
        font-weight: bold;
      }
	}
   .noInfo {
	  color: #f8f8f8 !important;
  	}
  }
}
.es-dialog.withdraw-info {
  width: 450px !important;
  height: 333px !important;
  border-radius: 2px;
  background: #f8f8f8;
  .icon-wrapper {
    position: relative;
    top: -15px;
    left: -30px;
    line-height: 58px;
    height: 58px;
    width: 115%;
    background: #fff;
  }
  .m-icon-close {
    cursor: pointer;
    position: relative;
    left: 414px;
    margin-bottom: 21px;
    color: #5f5f5f;
    font-size: 16px;
    transform: translate3d(0, -50%, 0);
    .m-icon-close();
  }
  .es-dialog-main {
    background: #f8f8f8;
  }
  .es-dialog-footer {
    padding: 0 !important;
    height: 38px !important;
    color: #fff !important;
    margin-top: 20px;
    text-align: right;
    .es-dialog-btn:first-child {
      width: 125px;
      background-color: #f8f8f8;
      color: #0d9737;
      border: none;
      height: 38px;
      line-height: 38px;
    }
    .es-dialog-btn:last-child {
      width: 125px;
      background-color: #0d9737;
      color: #fff;
      margin-right: 30px;
      height: 38px;
      line-height: 38px;
    }
  }
}
</style>
