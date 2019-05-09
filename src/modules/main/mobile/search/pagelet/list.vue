<template lang="html">
  <div class="m-search--list">
	  <AFSnapNav class="m-tab" v-model="sportType">
		  <AFSnapNavItem class="m-tab-item" v-for="item in sportList" :name="item.id" :key="item.id">
			  <span>{{item.name}}</span>
		  </AFSnapNavItem>
	  </AFSnapNav>

	  <template v-if="pageError">
          <div class="m-error-wrapper">
              <div>
                  <span class="m-error-msg">No internet connection</span>
                  <div class="m-btn" @click="loadData(true)">Reload</div>
              </div>
          </div>
      </template>

      <template v-else-if="pageLoading">
          <div class="m-error-wrapper">
              <div>
                  <i class="m-icon-loading"></i>
                  <span class="m-text-msg">Loading...</span>
              </div>
          </div>
      </template>

	  <template v-else-if="!hasData">
		  <div class="m-error-wrapper">
              <div>
                  <span class="m-error-msg m-empty">No results at this time</span>
              </div>
          </div>
	  </template>

	  <template v-else>
		  <ul class="m-list">
			  <EventItem v-for="item in events" :key="item.eventId" :event="item"/>
			  <div class="load-more" v-show="moreEvents && touching"></div>
  			  <div class="no-more" v-show="!moreEvents && hasScroll && needShowMoreTips">No More Records</div>
		  </ul>
	  </template>

  </div>
</template>

<script>
import 'utils/class';
import { closest } from 'utils/dom';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { UPDATE_CURRENT_TYPE } from 'store/searchEvents/mutationTypes';
import 'components/sanpNav';
import EventItem from './eventItem.vue';

export default {
	data() {
		return {
			pageLoading: false,
			pageError: false,
			sportType: 0,
			hasScroll: false,
			touching: false,
		};
	},
	components: {
		EventItem
	},
	computed: {
		...mapState('searchEvents', [
			'dataLoading',
			'moreLoading',
			'sportList',
			'errorInfo',
			'events',
			'currentType'
		]),
		...mapGetters('searchEvents', [
			'hasData',
			'moreEvents',
			'needShowMoreTips'
		])
	},
	watch: {
		dataLoading(val) {
			if (!val) {
				this.pageLoading && (this.pageLoading = false);
			} else {
				this.pageLoading = true;
			}
		},
		moreLoading(val) {
			const bodyDom = document.body;

			if (!val) {
				this.touching && (this.touching = false);
				this.hasScroll && (this.hasScroll = false);
				bodyDom.style.overflow = 'auto';
			} else {
				bodyDom.style.overflow = 'hidden';
			}
		},
		sportType(val) {
			if (val !== this.currentType) {
				this.updateType(val);
				this.loadData();
			}
		},
		errorInfo(val) {
			const { type = '' } = val || {};
			if (type === 'replace') {
				this.pageError = true;
				return;
			}

			if (!val) {
				this.pageError = false;
			}
		}
	},
	methods: {
		...mapActions('searchEvents', [
			'getList'
		]),
		...mapMutations('searchEvents', {
			updateType: UPDATE_CURRENT_TYPE
		}),
		loadData(isRefresh = false) {
			if (this.pageLoading) {
				return;
			}

			this.pageError = false;
			this.pageLoading = true;
			this.getList({
				isRefresh
			});
		},
		handleStart(e) {
			const target = e.target;

			if (target && this.hasData && (target.hasClass('m-list') || closest(target, '.m-list'))) {
				this.touching = true;
				this.startScroll = this.$el.scrollTop || 0;
			}
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
			if (this.hasScroll && this.moreEvents) {
				this.getList({
					isMore: true
				});
			} else {
				this.hasScroll = false;
			}
		},
	},
	created() {
		this.sportType = this.currentType;
		this.pageLoading = true;
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
@import '../style/list.less';
</style>
