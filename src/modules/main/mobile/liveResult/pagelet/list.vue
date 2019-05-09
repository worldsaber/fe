<template>
  <section class="result-list more-list">
		<template v-if="length"  >
			<Category v-for="tournament in resultList.tournaments" :data = "tournament" :key = "tournament.id"/>
			<div class="load-more" v-show="moreEvents && touching"></div>
			<div class="no-more" v-show = "!moreEvents && hasScroll && length >= count">No More Records</div>
		</template>
		<div class="isEmpty" v-else >No results at this time</div>  
  </section>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Category from './category';

export default {
	name: 'list',
	components: {
		Category
	},
	data() {
		return {
			loading: true,
			hasScroll: false,
			touching: false,
		};
	},
	computed: {
		...mapState('liveResult', ['resultList', 'count']),
		...mapGetters('liveResult', ['moreEvents']),
		length() {
			return !!this.resultList.tournaments ? this.resultList.tournaments.length : 0;
		}
	},
	methods: {
		...mapActions('liveResult', ['getResultList']),
		getMoreList () {
			if (this.moreEvents) {
				this.getResultList(true).then(() => {
					this.hasScroll = false;
				}).catch(() => {
					this.hasScroll = false;
				});
			}
		},
		handleStart(e) {
			this.touching = true;
			this.startScroll = this.$el.scrollTop || 0;
		},
		handleMove(e) {
			if (!this.touching) {
				return;
			}
			const outerHeight = this.$el.clientHeight,
				innerHeight = this.$el.scrollHeight || 0,
				scrollTop = this.$el.scrollTop,
				bottom = innerHeight - outerHeight - scrollTop;

			const diff = scrollTop - this.startScroll;
			if (diff > 0) {
				e.preventDefault();
			}
			if (bottom <= 0) {
				this.hasScroll = true;
			}
		},
		handleEnd(e) {
			this.touching = false;
			if (this.hasScroll && this.moreEvents) {
				this.getMoreList();
			} else {
				this.hasScroll = false;
			}
		},

	},
	mounted() {
		this.$el.addEventListener('touchstart', this.handleStart, false);
		this.$el.addEventListener('touchmove', this.handleMove, false);
		this.$el.addEventListener('touchend', this.handleEnd, false);
	},
	destroyed() {
		this.$el.removeEventListener('touchstart', this.handleStart, false);
		this.$el.removeEventListener('touchmove', this.handleMove, false);
		this.$el.removeEventListener('touchend', this.handleEnd, false);
	}
};
</script>
<style lang="less">
@import './list.less';
@import '~base/styles/variable.less';
.more-list{
	width: 100%;
	box-sizing: border-box;
	padding-top: 142/@rem;
	padding-bottom: 0;
	top:0;
	.load-more, .no-more{
		height: 51/@rem;
		line-height: 51/@rem;
		font-size: 12/@rem;
		text-align: center;
		background-color: @fogGray;
		color: @darkGray;	
	}
	.load-more{
		.m-icon-loading();
		&:before{
			display: inline-block;
			animation:loaddng .6s linear infinite;
			margin-right: 20/@rem;
		}
	}
	@keyframes loaddng{
	0%{transform:rotate(0)}
	50%{transform:rotate(180deg)}
	100%{transform:rotate(360deg)}
}
}
</style>
