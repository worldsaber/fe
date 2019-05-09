<template>
	<div class="m-promotion-wrap">
		<topNavBar></topNavBar>
		<p class="m-pm-nolist" v-if="list.length == 0"><i class="m-icon--pageques"></i>No promotions available.</p>
		<ul class="m-pm-list" v-else>
			<li v-for="(item, index) in list"
				:key="index"
				:class="{'m-pm-finish': item.status === 90}">
				<div class="m-pm-mask" v-if="item.status === 90">Finished</div>
				<a :href="item.linkUrl" target="_blank">
					<div class="m-img-container">
						<img :src="item.imgUrl" />
					</div>
					<div class="m-pm-period">{{item.showStartDate}} － {{item.showEndDate}}</div>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
import topNavBar from 'components/navbar';

export default {
	components: {
		topNavBar
	},
	props: {
		list: {
			type: Array,
			'default': function () {
				return [];
			}
		}
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";

.m-promotion-wrap {
  background: @white;
}
.m-pm-list {
  margin: 12/@rem auto 0;
  width: 91.1%;
  li {
    position: relative;
    margin-bottom: 12/@rem;

    img {
      display: block;
      width: 100%;
      height: auto;
	}

	a {
		display: block;
		border-radius: 2/@rem;
		overflow: hidden;
	}
  }

	.m-img-container {
		position: relative;
		width: 100%;
		padding-top: 210 / 660 * 100%;

		img {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;
		}
	}

  .m-pm-mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    line-height: 112/@rem;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-size: 20/@rem;
    font-weight: bold;
    color: @white;
    text-shadow: 0 2px 11px rgba(0, 0, 0, 0.4);
  }
  .m-pm-period {
    padding-left: 10/@rem;
    width: 100%;
    box-sizing: border-box;
    height: 32/@rem;
    line-height: 32/@rem;
    background: rgba(0, 0, 0, 0.8);
    color: @white;
    font-size: 14/@rem;
    z-index: 3;
  }
}
.m-pm-nolist {
  text-align: center;
  padding: 187/@rem 0 0;
  font-size: 16/@rem;
  color: @darkGray;
  .m-icon--pageques {
    .m-icon-pageques();
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    &::before {
      font-size: 23px;
    }
  }
}
</style>
