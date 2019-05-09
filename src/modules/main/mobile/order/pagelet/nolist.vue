<template lang="html">
	<div class="m-list-none-wrap">
		<div class="only-win" v-if="(settleType === 'Settled' || settleType === 'All')&&!isHistory">
			<span class="text">Show only winning tickets</span>
			<span :class="['outter',onlyWinnings?'on':'off']" @click="toggleOnlyWin"><span class="inner"></span></span>
		</div>
		<div class="m-list-none">
			<span class="no-list-txt">
				<!-- <i class="m-icon--pageques"></i> -->
				No tickets available.
			</span>
			<div class="view-more" v-if="!choosedDate && !isHistory && (settleType === 'Settled' || settleType === 'All')">
				<p>Show only tickets in last 6 months</p>
				<p @click="viewMore">View older tickets<i class="icon"></i></p>
			</div>
		</div>
		<div class="btns">
			<div class="btn" @click="jump('football')">
				<i class="football"></i>
				<p class="text">Today's</p>
				<p class="text">Football</p>
			</div>
			<div class="btn" @click="jump('sports')">
				<i class="all-sports"></i>
				<p class="text">All</p>
				<p class="text">Sports</p>
			</div>
			<div class="btn" @click="jump('live')">
				<i class="live"></i>
				<p class="text pad">LiveBetting</p>
			</div>
			<div class="btn" @click="jump('home')">
				<i class="home"></i>
				<p class="text pad">Home</p>
			</div>
		</div>
		<!-- <adConfig/> -->
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { pagePath } from 'config/pageConfig';
import adConfig from './bottomAd';

export default {
	components: {
		adConfig
	},
	data () {
		return {
			football: pagePath.preFootball,
			sports: pagePath.sports,
			live: pagePath.liveList,
			home: pagePath.home
		};
	},
	props: ['onlyWinnings', 'toggleOnlyWin', 'settleType', 'viewMore', 'choosedDate'],
	computed: {
		...mapState('order', [
			'isHistory'
		])
	},
	methods: {
		jump (path) {
			switch (path) {
			case 'football':
				location.href = this.football;
				break;
			case 'live':
				location.href = this.live;
				break;
			case 'home':
				location.href = this.home;
				break;
			case 'sports':
				location.href = this.sports;
				break;
			default:
				// no detault
			}
		}
	}
};
</script>

<style lang="less">
@import "base/styles/icon.less";
@import "base/styles/variable.less";
.m-list-none-wrap{
	.only-win {
		height: 40/@rem;
		line-height: 40/@rem;
		padding-right:15/@rem;
		text-align: right;
		border-bottom: 1/@rem solid @fogGray;
		.text {
			margin-right: 9/@rem;
			color: #000;
			font-size: 12/@rem;
			vertical-align: super;
		}
		.outter, .inner {
			display: inline-block;
			border: 1/@rem solid @green;
		}
		.outter {
			width: 31/@rem;
			height: 20/@rem;
  			line-height: 20/@rem;
			text-align: left;
			.inner {
				width: 16/@rem;
				height: 16/@rem;
				margin: 1/@rem 1/@rem 0 1/@rem;
				background: #fff;
			}
		}
		.off {
			background: @midGray;
		}
		.on {
			background: @lightGreen;
			text-align: right;
		}
	}
	.m-list-none {
	  padding: 60/@rem 0 88/@rem;
	  text-align: center;
	  .view-more {
		margin-top: -10/@rem;

		p:first-child {
			margin-top: 19/@rem;
			color: @darkGray;
		}
		p:last-child {
			padding-bottom: 15/@rem;
			color: @linkBlue;
			.icon {
				.m-icon-arrow--right();
				&:before {
					font-size: 12/@rem;
					margin-left:5/@rem;
				}
			}
		}
  	}
}
	.no-list-txt {
	  font-size: 16/@rem;
	  color: @darkGray;
	  .m-icon--pageques {
		display: block;
		margin: 0 auto 13/@rem;
		height: 46/@rem;
		line-height: 46/@rem;
		.m-icon-pageques();
		&::before {
		  color: @midGray;
		  font-size: 46/@rem;
		}
	  }
	}
	a, a:hover, a:active {
		text-decoration: none;
		color: #000
	}

	.btns {
		display: flex;
		position: fixed;
		width: 100%;
		bottom: 10/@rem;
	  color: #000;
	  .btn {
		  flex: 1;
		  display: flex;
		  flex-flow: column;
	  }
	  i, .text {
		  text-align: center;
	  }
	  .pad {
		  padding-top: 10/@rem;
	  }
	  .football {
		.m-icon--football();
		&::before {
		  font-size: 24/@rem;
		}
	  }
	  .all-sports {
		.m-icon-all();
		&::before {
		  font-size: 24/@rem;
		  font-weight: 600;
		}
	  }
	  .live {
		.m-icon-tv();
		&::before {
		  font-size: 24/@rem;
		}
	  }
	  .home {
		.m-icon-home();
		&::before {
		  font-size: 24/@rem;
		}
	  }
	}
}
</style>
