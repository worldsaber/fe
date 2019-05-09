<template lang="html">
	<div style="background:#fff;">
		<div class="m-list-none">
			<span class="no-list-txt">
				<i class="m-icon--pageques"></i>
				No records.
			</span>
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
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig.js';

export default {
	data () {
		return {
			football: pagePath.preFootball,
			sports: pagePath.sports,
			live: pagePath.liveList,
			home: pagePath.home
		};
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

.m-list-none {
  padding: 138/@rem 0 88/@rem;
  text-align: center;
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
</style>
