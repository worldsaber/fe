<template>
    <div class="m-navbar">
        <div class="m-navbar-item">
            <slot name="left">
				<a href="javascript:;" @click.stop="clickHandler"><i class="m-navbar-back"></i>{{backText}}</a>
			</slot>
        </div>
        <div class="m-navbar-item">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>
import { isEmptyObject } from 'utils';

export default{
	props: {
		// 页面引入路由的话可以传入路由对象，否则请用link参数或者不传
		router: {
			type: Object,
			validator (value) {
				return !isEmptyObject(value) && (value.path || value.name);
			}
		},
		link: {
			type: String,
			'default': ''
		},
		// 返回文字定制
		backText: {
			type: String,
			'default': 'Back'
		},
		// 返回图标自定义点击事件
		backClick: {
			type: Function
		}
	},
	methods: {
		clickHandler () {
			if (this.router && this.$router) {
				this.$router.push(this.router);
			} else if (this.link !== '' && (this.link.substr(0, 1) === '/' || this.link.indexOf('http') === 0)) {
				window.location.href = this.link;
			} else if (this.backClick) {
				this.backClick();
			} else {
				window.history.go(-1);
			}
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-navbar {
  	height: 40/@rem;
  	padding: 0 5.5% 0 3.5%;
	position: relative;
	display: flex;
	box-sizing: border-box;
	background:@fogGray;
	color:@dark;

  &-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }

  &-item {
    flex: 1;
    font-size: 14/@rem;
    white-space: nowrap;
		align-items: center;
		display: flex;
		a{
			text-decoration: none!important;
			color: @dark;
		}
    &:first-child {
			order: 1;
			align-items: center;
    }
    &:last-child {
      order: 2;
      justify-content: flex-end;
      > a {
        justify-content: flex-end;
      }
    }
  }

  &-back{
		.m-icon-wap-back();
		margin-right: 13.7/@rem;
    &::before{
			font-size: 11/@rem;
      color:@dark;
    }
  }
}
// app下不显示
#sportybet{
	.m-navbar{
		display: none !important;
	}
}
</style>
