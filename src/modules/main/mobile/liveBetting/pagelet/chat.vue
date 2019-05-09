<template>
	<div id="popup-chat">
		<transition name="fade">
			<div class="popup-modal" v-if="isShow" @click="close"></div>
		</transition>
		<transition name="slide">
			<div :class="['chat-container', {'empty': isEmpty}]" v-if="isShow">
				<i class="m-close" @click="close"/>
				<div class="m-body" ref="scroll-body">
				  <ul class="comment-list" v-if="!isEmpty">
				    <li v-for="(item, index) in list" :class="['comment-item', {
						'comment-item--highlight': currentId === item.replyerUserId
						}]" :key="index">
						<img class="avatar" :src="item.replyerAvatarUrl ? '//s.sporty.net/' + item.replyerAvatarUrl : defaultAvatar"/>
						<p class="comment-wrap">
							<span class="nick-name">{{item.replyerNickName}}:</span>
							<span v-if="item.textArr.length>0"
								v-for="(text,i) in item.textArr"
								:key="i"
								@click="goToBetslip(item.bookingCodes,text)"
								:class="{'booking-code':item.bookingCodes.includes(text)}">{{text}}</span>
							<span v-if="item.textArr.length===0">{{item.text}}</span>
						</p>
					</li>
					<li class="comment-item no-more" v-if="!hasMore && list.length > 20"> - No more chats - </li>
				  </ul>
				 <div class="empty-comment-wrap" v-else>
				 	<p class="empty-msg">Seems a little quiet here<p>
					<p class="empty-msg">Be the first to talk about this match</p>
					<div class="empty-btn" @click="startChat"><i class="icon-chat"/>Start chatting...</div>
				 </div>
				</div>
				 <div v-if="!isEmpty" :class="['refresh-btn', {'refresh': refreshing}, {'empty': isEmpty}]" @click="refresh"><i class="refresh-icon"/></div>
				<div v-if="!isEmpty" class="start-chat" @click="startChat"><i class="icon-chat"/>Start chatting...</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { checkNickname } from 'components/nickName';
import cookie from 'storage/cookie';
import loginMixin from 'base/js/loginMixin';
import defaultAvatar from 'base/images/default_avatar@2x.png';
import { mapState, mapActions, mapMutations } from 'vuex';
import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';

export default {
	mixins: [loginMixin],
	props: {
		topicId: {
			type: Number,
			'default': 0
		},
		isShow: {
			type: Boolean,
			'default': false
		},
		firstPage: {
			type: Array,
			'default': () => []
		},
		count: {
			type: String,
			'default': ''
		},
		currentId: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			list: [],
			refreshing: false,
			isLoading: false,
			defaultAvatar,
			hasMore: true
		};
	},
	created() {
		this.list = this.firstPage.slice(0);
		if (!this.nickname) {
			// 获取 nickname 等基本信息
			this.fetchAccountBaseInfo();
		}
	},
	mounted() {

	},
	beforeDestroy() { // 非正常跳页面时还原副作用
		this.enableScroll();
	},
	computed: {
		...mapState('me', ['nickname']),
		isEmpty() {
			return this.firstPage.length === 0;
		},
		lastId() {
			const last = this.list[this.list.length - 1];
			return last ? last.commentId : '';
		}
	},
	methods: {
		 ...mapMutations('layout', {
			toggleRight: TOGGLE_RIGHT
		}),
		...mapActions('me', ['fetchAccountBaseInfo']),

		goToBetslip(codes, text) {
			if (codes.includes(text)) {
				this.loadBetslip({
					betCode: text
				}).then(() => {
					this.toggleRight(true);
				}).catch(e => console.log(e));
			}
		},
		...mapActions('betslip', ['loadBetslip']),
		close() {
			this.$emit('close');
		},
		disabledScroll() { // 禁layout上的滚动
			document.querySelector('.m-main .m-main-mid').style.overflow = 'hidden';
		},
		enableScroll() {
			document.querySelector('.m-main .m-main-mid').style.overflow = 'auto';
		},
		refresh() {
			const container = this.$refs['scroll-body'];
			this.refreshing = true;
			container.scrollTop = 0;
			this.$parent.fetchComment().then(() => {
				this.refreshing = false;
				this.hasMore = true;
			});
		},
		startChat() {
			if (!this.checkLogin()) {
				return;
			}
			if (!checkNickname()) {
				return;
			}
			this.$emit('showEditor');
		},
		bindEvent() {
			this.$nextTick(() => {
				const container = this.$refs['scroll-body'];
				container.addEventListener('scroll', this.handleScroll);
			});
		},
		unBindEvent() {
			const container = this.$refs['scroll-body'];
			container.removeEventListener('scroll', this.handleScroll);
		},
		handleScroll() {
			const container = this.$refs['scroll-body'];
			if (container.scrollTop + container.clientHeight >= container.scrollHeight && this.hasMore && !this.isLoading) {
				console.log('load more');
				this.fetchMore();
			}
		},
		fetchMore() {
			this.isLoading = true;
			const body = {
				lastId: this.lastId,
				postId: this.topicId,
				apiLevel: 1,
				productId: window.country.toUpperCase()
			};
			if (window.loginStatus) {
				body.userToken = cookie('accessToken');
				body.accountId = cookie('phone');
			}
			fetch('#/quanzi/lottery/circle_matchPostInfo.html', {
				body
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.result === 100) {
					const moreList = res.post.comments || [];
					moreList.map(item => {
						item.textArr = [];
						if (item.text.match(/bc[\S]{5}/gi)) {
							item.bookingCodes = item.text.match(/bc[\S]{5}/gi);
							let temp = item.text;
							item.bookingCodes.map(code => {
								item.textArr.push(temp.split(code)[0]);
								item.textArr.push(code);
								temp = temp.split(code)[1];
								return temp;
							});
							item.textArr.push(temp);
						}
						return item;
					});
					this.list = this.list.concat(moreList);
					if (res.post.comments.length === 0) {
						this.hasMore = false;
					}
				} else if (res.result === 204) {
					// login session timeout
					return this.login();
				}
			});
		},
	},
	watch: {
		firstPage() {
			this.list = this.firstPage.slice(0);
		},
		isShow(val) {
			if (val) {
				this.disabledScroll();
				this.bindEvent();
			} else {
				this.enableScroll();
				this.unBindEvent();
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";
body {
	width: 100%;
}
#popup-chat {
	.popup-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: @dark;
		opacity: 0.4;
		overflow: hidden;
		z-index: 500;
	}
	.chat-container {
		z-index: 501;
		position: fixed;
		width: 100%;
		height: 50%;
		bottom: 0;
		padding-top: 32/@rem;
		padding-bottom: 46/@rem;
		left: 0;
		background-color: @dark;
		&.empty {
			padding-bottom: 0;
		}
		.m-close {
			position: absolute;
			top: 12/@rem;;
			right: 12/@rem;
			.m-icon-close();
			&::before {
				font-size: 12/@rem;
			}
		}

		.m-body {
			width: 100%;
			height: 100%;
			overflow: auto;
			.comment-list {
				.comment-item {
					position: relative;
					padding: 4/@rem 8/@rem;
					&.no-more {
						color: @white;
						text-align: center;
						line-height: 16/@rem;
					}
					&.comment-item--highlight {
						border-left: 2px solid @green;
					}
					.avatar {
						position: absolute;
						top: 4/@rem;
						left: 8/@rem;
						line-height: 16/@rem;
						width: 16/@rem;
						height: 16/@rem;
						border-radius: 8/@rem;
						margin-right: 6/@rem;
					}
					.comment-wrap {
						color: @white;
						word-break: keep-all;
						word-wrap: break-word;
						padding-left: 22/@rem;
						font-size: 14/@rem;
						line-height: 16/@rem;
						.nick-name {
							font-size: 12/@rem;
							margin-right: 5/@rem;
							color: @darkGray;
						}
						.booking-code {
							font-size: 14/@rem;
							color: @green;
							text-decoration-line: underline;
						}
					}
				}
			}
			.empty-comment-wrap {
				padding-top: 80/@rem;
				.empty-msg {
					text-align: center;
					font-size: 12/@rem;
					line-height: 16/@rem;
					color: @darkGray;
				}
				.empty-btn {
					margin-left: auto;
					margin-right: auto;
					margin-top: 17/@rem;
					width: 157/@rem;
					text-align: center;
					line-height: 36/@rem;
					border: 1px solid @midGreen;
					border-radius: 2px;
					color: @midGreen;
				}
			}
		}
		.refresh-btn {
			position: absolute;
			bottom: 58/@rem;
			right: 12/@rem;
			width: 36/@rem;
			height: 36/@rem;
			line-height: 36/@rem;
			border-radius: 18/@rem;
			text-align: center;
			opacity: 0.7;
			background-color: #000000;
			.refresh-icon {
				vertical-align: middle;
				.m-icon-refresh();
			}
			&:active {
				background-color: @darkGray;
			}
			&.refresh {
				animation: circles 0.5s linear infinite;
			}
			&.empty {
				bottom: 10/@rem;
			}
		}
		.start-chat {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 45/@rem;
			border-top: 1px solid @darkGray;
			text-align: center;
			color: @midGreen;
			font-size: 14/@rem;
			line-height: 45/@rem;
			&:active {
				background-color: @darkGray;
			}
		}
		.icon-chat {
			margin-right: 9/@rem;
			.m-icon-chat-xx();
			&::before {
				color: @midGreen;
			}
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	.slide-enter-active, .slide-leave-active {
		transition: all .3s ease;//cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-enter, .slide-leave-to {
		transform: translateY(100%);
		//opacity: 0;
	}
}
</style>
