<template>
<div>
	<BackBar backText="Back"></BackBar>
	<div v-if="event && event.eventId" class="m-event-detail-wrap" :data-sport-name="currentSportName">
		<div class="m-broadcast" @click="toggleChat(true)">
			<div class="live-broadcast">
				<template v-if="showBroadcast">
					<Broadcast ref="broadcast" v-if="firstPageComments.length > 0">
					<div slot="bdcastList">
						<div class="comment-item" v-for="(item, index) in broadcastComments" :key="index">
							<img class="avatar" :src="item.replyerAvatarUrl ? '//s.sporty.net/' + item.replyerAvatarUrl : defaultAvatar"/>
							<span class="nickname">{{item.replyerNickName}}:</span>
							<div class="comment-text">{{item.text}}</div>
						</div>
					</div>
		 			</Broadcast>
					<div class="empty-comment-msg" v-else>Be the first to talk about this match</div>
				</template>
			</div>
			<div class="chat-button"><i class="chat-icon"/>Chat</div>
		</div>
		<div class="tracker-content">
			<div class="m-tracker-wrap"  v-if="streamStatus">
				<LiveStreamPlayer :eventId="$route.params.eventId || currentEventId" />
				<div class="arro" @click="handleToggleStream"><i>Hide</i></div>
			</div>
			<div class="m-tracker-wrap" v-if="lmtsStatus">
				<LiveMatchTracker type="lmts" :eventId="$route.params.eventId || currentEventId" />
				<div class="arro" @click="handleToggleLMTS"><i>Hide</i></div>
			</div>
			<div class="m-tracker-wrap" v-if="statisticsStatus">
				<LiveMatchStatistics :eventId="$route.params.eventId || currentEventId" />
				<div class="arro" @click="handleToggleStatistics"><i>Hide</i></div>
			</div>
		</div>
		<div class="m-event-title" v-if="!(streamStatus || lmtsStatus || statisticsStatus)">
			<div class="change-match-overly" v-show="isShowChangeMatch" @click="isShowChangeMatch = false" v-if="!(streamStatus || lmtsStatus || statisticsStatus)"></div>
			<div>
				<div class="m-event-league">{{event.categoryName}} {{event.tournamentName}}</div>
				<div class="m-event-title-time">
					<!--  * 0:NotStarted; 1:Live; 2. suspended; 3:Ended; 4:Finished("closed"); 5:Cancelled; 6:Abandoned; 7 Delayed; 8:Unknown -->
					<div class="event-time">
						<template v-if="event.status === 1 || event.status === 2">
							<span>{{event.matchStatus || ''}}</span>
							<span>{{getSeconds(currentSportId === 'sr:sport:2' ? event.remainingTimeInPeriod : event.playedSeconds, true)}}</span>
						</template>
						<!-- 完了 -->
						<template v-else-if="event.status === 4 || event.status === 3">
							<span>Finished</span>
						</template>
						<!-- 没开始 -->
						<template v-else-if="event.status === 0 || event.status === 7">
							<span>Upcoming</span>
						</template>
							<template v-else-if="event.status === 5 || event.status === 6 || event.status === 8">
							<span>Closed</span>
						</template>
						<!-- 其他情况 -->
						<template v-else>
							<span></span>
						</template>
						<!-- 显示当前小节数目 -->
					</div>
					<div class="change-match" tabindex="0" @click="toggleChangeMatch"  @blur="isShowChangeMatch = false">
						<div class="change-match-title"><span class="text">Change Match</span><em :class="['icon-triangle', {
							active: isShowChangeMatch
						}]"></em></div>
						<div class="change-match-content-wrap"  v-show="isShowChangeMatch" @scroll.stop="noop">
							<div class="change-match-content">
								<template v-if="liveThumbnailMatch && liveThumbnailMatch.length">
									<dl v-for="(data, index) in liveThumbnailMatch" :key="index">
										<dt>{{data.categoryName}} {{data.name}}</dt>
										<dd v-for="(event, i) in data.events" :key="i" @click="jumpEvent(data.categoryId, data.id, event.eventId)">
											<span class="time">
												<em v-if="currentSportId === 'sr:sport:1' || currentSportId === 'sr:sport:2' || currentSportId === 'sr:sport:12'">{{currentSportId === 'sr:sport:2' ? event.remainingTimeInPeriod : event.playedSeconds}}</em>
												<em>{{event.matchStatus || ''}}</em>
											</span>
											<span class="team">
												<em>{{event.homeTeamName}}</em>
												<em>{{event.awayTeamName}}</em>
											</span>
											<span class="set-score">
												<em v-for="(one, index) in (event.setScore || '').split(':')" :key="index" class="set-score">
													{{one || ''}}
												</em>
											</span>
											<span class="game-score" v-if="currentSportId === 'sr:sport:5'">
												<template v-if="event.gameScore && event.gameScore.length">
													<em v-for="(one, index) in event.gameScore[event.gameScore.length - 1].split(':')"
													:key="index">
														{{one || ''}}
													</em>
												</template>
											</span>
										</dd>
									</dl>
								</template>
								<template v-else>
									<div class="no-data">
										<p>Sorry, there are no games currently</p>
										<p>available in this category.</p>
										<p>Please try later. Thank you.</p>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<div class="m-event-team-wrap">
					<div class="home-team-name">
						<span class="team">{{event.homeTeamName}}</span>
						<span class="score">
							<em class="setScore">{{setScore[0]}}</em>
							<template v-if="isShowGameScore">
								<em class="gameScore">{{gameScore[0]}}</em>
								<em class="gameScore" v-if="pointScore">{{pointScore[0]}}</em>
							</template>
						</span>
					</div>
					<div class="away-team-name">
						<span class="team">{{event.awayTeamName}}</span>
						<span class="score">
							<em class="setScore">{{setScore[1]}}</em>
							<template v-if="isShowGameScore">
								<em class="gameScore">{{gameScore[1]}}</em>
								<em class="gameScore" v-if="pointScore">{{pointScore[1]}}</em>
							</template>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="m-event-tracker">
			<span :class="['live-stream', streamStatus ? 'active' : '']" v-if="liveChannel" @click="handleToggleStream">Live stream</span>
			<span :class="['match-tracker', lmtsStatus ? 'active' : '']" v-if="isSupportLmts" @click="handleToggleLMTS">Match tracker</span>
			<span :class="['match-statistics', statisticsStatus ? 'active' : '']" v-if="isSupportStatistics" @click="handleToggleStatistics">Statistics</span>
		</div>
		<EventDetail class="live-match" source="live" :isScrollNavFixed="true" v-if="!isLoading"></EventDetail>
		<chatView :isShow='showChat' :firstPage="firstPageComments" :count="commentCount" :topicId="event.topicId" :currentId="currentId" @close="toggleChat(false)" @showEditor="toggleEditor(true)"/>
		<CommentEditor
		 	class="live-editor"
			:visible="showEditor"
			placeholder="Start chatting..."
			:maxLength="280"
			:showLimit="260"
			:loading="editorLoading"
			:scrollIntoViewOption="false"
			@submit="handleSubmit"
			@close="toggleEditor(false)"/>
	</div>
</div>
</template>

<script>
	import { mapActions, mapState, mapMutations } from 'vuex';
	import cookie from 'storage/cookie';
	import 'components/sanpNav';
	import 'packages/select';
	import BackBar from 'components/navbar';
	import 'components/broadcast';
	import CommentEditor from 'components/editor';
	import EventDetail from 'components/eventDetail/eventDetail.vue';
	import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';
	import LiveStreamPlayer from 'packages/liveStreamPlayer/liveStreamPlayer.vue';
	import LiveMatchStatistics from 'packages/liveMatchStatistics/index.vue';
	import dateFormat from 'kernel/js/dateFormat';
	import sportsConfig, { sportsConfigById } from 'config/sports';
	import { baseUrl } from 'config/pageConfig';
	import { CHANGE_LOADING } from 'store/layout/mutationTypes';
	import { getSeconds } from 'base/js/utils';
	import loginMixin from 'base/js/loginMixin';
	import defaultAvatar from 'base/images/default_avatar@2x.png';
	import chatView from './chat.vue';

	// event status 0:NotStarted; 1:Live; 2. suspended;
	// 3:Ended; 4:Finished("closed"); 5:Cancelled; 6:Abandoned; 7 Delayed; 8:Unknown
	export default {
		name: 'eventDetailPage',
		mixins: [loginMixin],
		components: {
			CommentEditor,
			EventDetail,
			BackBar,
			LiveMatchTracker,
			LiveStreamPlayer,
			LiveMatchStatistics,
			chatView
		},
		data () {
			return {
				currentMatch: '',
				productId: 1,
				isShowChangeMatch: false,
				streamStatus: false,
				lmtsStatus: false,
				statisticsStatus: false,
				showChat: false,
				showEditor: false,
				firstPageComments: [],
				commentCount: '',
				showBroadcast: false,
				editorLoading: false,
				defaultAvatar,
				currentId: ''
			};
		},
		computed: {
			eventStatus () {
				const status = event.status;
				if (event.playedSeconds) {
					return event.playedSeconds;
				}
				switch (status) {
				case 0:
					return 'Upcoming';
				case 4:
					return 'Finished';
				case 5:
					return 'Cancelled';
				default:
					return '';
				}
			},
			setScore () {
				if (this.event && this.event.setScore) {
					return this.event.setScore.split(':');
				}
				return ['', ''];
			},
			gameScore () {
				if (this.event && this.event.gameScore && this.event.gameScore.length) {
					let gameScore = this.event.gameScore;
					gameScore = gameScore[gameScore.length - 1];
					return gameScore.split(':');
				}
			},
			// Tennis, Volleyball, Beach Volley, Darts 显示 gameScore
			isShowGameScore () {
				const { currentSportId } = this;
				const { gameScore } = this.event;
				return [
					'sr:sport:5',
					'sr:sport:23',
					'sr:sport:34',
					'sr:sport:22'
				].includes(currentSportId) && gameScore;
			},
			pointScore () {
				if (this.event && this.event.pointScore) {
					return this.event.pointScore.split(':');
				}
			},
			// 是否支持matchTracker
			isSupportLmts () {
				return [
					'sr:sport:1',
					'sr:sport:2',
					'sr:sport:5',
					'sr:sport:6',
					'sr:sport:4',
					'sr:sport:23',
					'sr:sport:34',
					'sr:sport:22'
				].includes(this.currentSportId);
			},
			// 是否支持数据分析
			isSupportStatistics () {
				return [
					'sr:sport:1',
					'sr:sport:6',
					'sr:sport:4',
					'sr:sport:23',
					'sr:sport:34',
					'sr:sport:22'
				].includes(this.currentSportId);
			},
			currentSportName () {
				if (this.currentSportId) {
					return sportsConfigById[this.currentSportId].name;
				}
				return 'football';
			},
			broadcastComments () {
				const length = this.firstPageComments.length > 5 ? 5 : this.firstPageComments.length;
				return this.firstPageComments.slice(0, length);
			},
			...mapState('eventDetail', [
				'event',
				'liveThumbnailMatch',
				'currentEventId',
				'currentSportId',
				'liveChannel']),
			...mapState('layout', ['isLoading']),
		},
		methods: {
			toggleChat(val) {
				this.showChat = val;
			},
			toggleEditor(val) {
				this.showEditor = val;
			},
			handleSubmit(value) {
				if (!value) {
					this.$toast('Please write a comment');
					return;
				}
				this.editorLoading = true;
				fetch('#/quanzi/lottery/circle_replyMatchPosts.html', {
					method: 'POST',
					body: {
						postId: this.event.topicId,
						userToken: cookie('accessToken'),
						accountId: cookie('phone'),
						text: value,
						productId: window.country.toUpperCase()
					}
				}).then(res => res.json()).then(res => {
					this.editorLoading = false;
					if (res.result === 100) {
						this.toggleEditor(false);
						const container = document.querySelector('#popup-chat .m-body');
						container.scrollTop = 0;
						this.fetchComment();
						this.$toast('Sent successfully');
						const input = document.querySelector('.m-input');
						input && input.blur();
					} else if (res.result === 204) {
						// login session timeout
						return this.login();
					} else {
						this.$toast(res.resultDesc ? res.resultDesc : 'Failed to send, please try again');
					}
				}).catch(e => {
					this.editorLoading = false;
					this.$toast('Failed to send, please try again');
					console.log(e);
				});
			},
			getSeconds (...arg) {
				return getSeconds(...arg);
			},
			jumpEvent (categoryId, tournamentId, eventId) {
				const baseURL = `${baseUrl}sport/${this.currentSportName}/live`;
				window.location.href = `${baseURL}/${categoryId}/${tournamentId}/${eventId}`;
			},
			toggleChangeMatch () {
				this.isShowChangeMatch = !this.isShowChangeMatch;
				if (this.isShowChangeMatch) {
					this.updateLiveThumbnailMatch();
				}
			},
			// 切换比赛
			changeMatch (match) {
				this.$router.push({
					name: 'eventView',
					params: {
						sportName: match.sportName,
						categoryId: match.categoryId,
						tournamentId: match.tournamentId,
						eventId: match.eventId
					}
				});
				this.loadinData(match.sportId, match.eventId);
			},
			loadinData (sportId, eventId) {
				// 已经存在一个event，先unsub
				if (this.event && this.event.eventId) {
					this.unsub({
						sportId: this.event.sportId,
						eventId: this.event.eventId,
						tournamentId: this.event.tournamentId,
						categoryId: this.event.categoryId,
						productId: this.productId
					});
				}
				this.setSport({
					eventId,
					sportId
				});
				const fetchEventParam = {
					productId: this.productId
				};
				if (eventId) {
					fetchEventParam.eventId = eventId;
				}
				this.pageLoading(true);
				// 进入页面直接获取event数据和marketGroup数据
				Promise.all([
					this.fetchEvent(fetchEventParam),
					this.fetchMarketGroup(sportId),
					this.fetchThumbnailMatch({
						sportId,
						productId: this.productId
					}),
					this.fetchFavorMarketIds({
						sportId,
						productId: this.productId,
					}),
				])
				.then(() => {
					this.pageLoading(false);
					this.sub({
						sportId: this.event.sportId,
						eventId: this.event.eventId,
						tournamentId: this.event.tournamentId,
						categoryId: this.event.categoryId,
						productId: this.productId
					});
					this.fetchComment();
				})
				.catch(() => {
					this.pageLoading(-1);
				});
			},
			fetchComment() {
				this.showBroadcast = false;
				const body = {
					postId: this.event.topicId,
					apiLevel: 1,
					productId: window.country.toUpperCase()
				};
				if (window.loginStatus) {
					body.userToken = cookie('accessToken');
					body.accountId = cookie('phone');
				}
				return fetch('#/quanzi/lottery/circle_matchPostInfo.html', {
					body
				}).then(res => res.json()).then(res => {
					if (res.result === 100) {
						this.firstPageComments = res.post.comments || [];
						this.firstPageComments.map(item => {
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
						this.currentId = res.currentUserId || '';
						this.commentCount = res.post.commentCount;
						this.$nextTick(() => {
							this.showBroadcast = true;
						});
					} else if (res.result === 204) {
						// login session timeout
						return this.login();
					} else {
						this.showBroadcast = true;
					}
				});
			},
			getDate(time) {
				return dateFormat.format(time, 'MM/DD dddd');
			},
			getTime(time) {
				return dateFormat.format(time, 'hh:mm');
			},
			...mapActions('eventDetail', [
				'fetchEvent',
				'setSport',
				'fetchThumbnailMatch',
				'fetchMarketGroup',
				'fetchFavorMarketIds',
				'sub',
				'unsub']),
			...mapMutations('layout', {
				pageLoading: CHANGE_LOADING
			}),
			updateLiveThumbnailMatch () {
				this.fetchThumbnailMatch({
					sportId: this.currentSportId,
					productId: this.productId
				});
			},
			handleToggleStream () {
				this.streamStatus = !this.streamStatus;
				if (this.streamStatus) {
					this.lmtsStatus = false;
					this.statisticsStatus = false;
				}
			},
			handleToggleLMTS () {
				this.lmtsStatus = !this.lmtsStatus;
				if (this.lmtsStatus) {
					this.streamStatus = false;
					this.statisticsStatus = false;
				}
			},
			handleToggleStatistics () {
				this.statisticsStatus = !this.statisticsStatus;
				if (this.statisticsStatus) {
					this.streamStatus = false;
					this.lmtsStatus = false;
				}
			},
			noop () {}
		},
		beforeDestroy () {
			if (this.event && this.event.eventId) {
				this.unsub({
					sportId: this.event.sportId,
					eventId: this.event.eventId,
					tournamentId: this.event.tournamentId,
					categoryId: this.event.categoryId,
					productId: this.productId
				});
			}
		},
		created () {
			const { params = {}} = this.$route;
			const eventId = params.eventId;
			const sportId = sportsConfig[params.sportName].id;
			this.loadinData(sportId, eventId);
		},
		mounted () {
			const container = document.querySelector('.m-main-mid');
			if (container) {
				container.addEventListener('scroll', () => {
					this.isShowChangeMatch = false;
				}, false);
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
html, body{
	background-color: @darker;
}
@keyframes broadcast {
	100%{
		transform: translate(-200%, 0);
	}
}
.m-event-detail-wrap{
	color: @white;
	.m-broadcast {
		position: relative;
		padding: 8/@rem 12/@rem;
		padding-right: 82/@rem;
		background-color: @darker;
		line-height: 24/@rem;
		.live-broadcast {
			height: 24/@rem;
			overflow: hidden;
			.empty-comment-msg {
				padding-left: 100%;
				font-size: 12/@rem;
				color: @white;
				animation-duration: 150ms;
				white-space: nowrap;
				animation: broadcast 8s linear infinite;
			}
			.comment-item {
				display: inline-block;
				vertical-align: middle;
				.avatar {
					margin-right: 6/@rem;
					display: inline-block;
					vertical-align: middle;
					width: 16/@rem;
					height: 16/@rem;
					border-radius: 8/@rem;
				}
				.nickname {
					display: inline-block;
					vertical-align: middle;
					margin-right: 6/@rem;
					color: @darkGray;
					font-size: 12/@rem;
				}
				.comment-text {
					padding-right: 24/@rem;
					display: inline-block;
					vertical-align: middle;
					font-size: 14/@rem;
					color: @white;
				}
			}
		}
		.chat-button {
			position: absolute;
			right: 12/@rem;
			top: 8/@rem;
			display: inline-block;
			padding: 0 12/@rem;
			border: 1px solid @midGreen;
			color: @midGreen;
			border-radius: 12/@rem;
			line-height: 22/@rem;
			height: 22/@rem;
			.chat-icon {
				margin-right: 4/@rem;
				.m-icon-chat-xx();
				&::before {
					color: @midGreen;
				}
			}
		}
	}
	.m-event-tracker{
		padding: 0 10/@rem 30/@rem 0;
		font-size: 12/@rem;
		text-align: right;
		background-color: @blueBlack;
		>span{
			display: inline-block;
			padding: 0 8/@rem;
			border-radius: 2px;
			height: 20/@rem;
			line-height: 20/@rem;
			&:last-child{
				margin-right: 0px;
			}
			color: @midGray;
			&::before{
				display:inline-block;
				padding-right: 5/@rem;
				vertical-align: top;
			}
			&.live-stream{
				.m-icon-live-stream();
				&::before{
					color: @midGreen;
				}
			}
			&.match-tracker{
				.m-icon-live-tracker();
				&::before{
					color: #ffb404;
				}
			}
			&.match-statistics{
				.m-icon-live-statistic();
				&::before{
					color: #03bdff;
				}
			}
			&.active{
				background-color: @lightGreen;
				color: @dark;
				&:before{
					color: @dark;
				}
			}
		}
	}
	.tracker-content{
		.m-tracker-wrap{
			background: @dark;
			.m-livetracker{
				background: @dark;
			}
			.arro{
				position: relative;
				background-color: @blueBlack;
				border-top: 3px solid @dark;
				padding-bottom: 10/@rem;
				i{
					width: 62/@rem;
					height: 23/@rem;
					background: url(../img/arra.svg);
					background-position: top left;
					background-size: 100% 100%;
					position: relative;
					left: 50%;
					margin-left: -31/@rem;
					display: block;
					text-align: center;
					top: -3px;
					line-height: 23/@rem;
				}
			}
		}
	}
	.m-event-title{
		background-color: @blueBlack;
		padding-bottom: 15/@rem;
		.icon-triangle{
			display: inline-block;
			&:after{
				content: '\e6a3';
				font-family: "iconfont" !important;
				font-size: 14/@rem;
				font-style: normal;
				display: inline-block;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				line-height: 1.4;
				height: 14/@rem;
				overflow: hidden;
				color: @midGreen;
			}
			&.active{
				transform: rotate(-90deg);
			}
		}
		.m-event-league{
			padding: 8/@rem 0;
			margin: 0 10/@rem;
			border: 1px solid fade(@lightGray, 15%);
			border-width: 1px 0px;
			line-height: 1.2;
			color: @darkGray;
		}
		.m-event-team-wrap{
			margin: 0 10/@rem;
			&>div{
				display: flex;
				&>span{
					flex: 1;
					display: block;
				}

			}
			.home-team-name{
				margin-bottom: 2/@rem;
			}
			.home-team-name,.away-team-name {
				display: flex;
				justify-content: stretch;
				font-size: 14/@rem;
				&>span{
					flex: 1;
					// 低端android不设置
					height: 22/@rem;
					line-height: 22/@rem;
				}
				.score{
					font-weight: 700;
					text-align: right;
					flex: 0 0 auto;
					.setScore,.gameScore{
						display: inline-block;
						height: 100%;
						line-height: normal;
						box-sizing: border-box;
						text-align: center;
						vertical-align: top;
					}
					.setScore {
						background-color: @lightGreen;
						color: @dark;
						padding: 2/@rem 6/@rem;
					}
					.gameScore {
						color: @lightGreen;
						background-color: fade(@lightGray, 15%);
						// padding: 2/@rem 6/@rem;
						padding: 2/@rem 0;
						min-width: 22/@rem;
					}
				}
				.team{
					width: 50%;
					font-weight: 500;
					margin-right: 2/@rem;
					line-height: 1.2;
					padding: 3/@rem 0 3/@rem 5/@rem;
					box-sizing: border-box;
					overflow: hidden;
					font-weight: 700;
					background: fade(@lightGray, 15%);
				}
			}
		}
		.m-event-title-time{
			height: 32/@rem;
			line-height: 32/@rem;
			padding: 0 10/@rem;
			.event-time{
				span{
					display: inline-block;
					padding-right: 10/@rem;
					&:last-child{
						padding-right: 0;
					}
				}
			}
			.change-match{
				.change-match-title{
					text-align: right;
					color: @midGreen;
					.text{
						display: inline-block;
						padding-right: 10/@rem;
					}
				}
			}
			display: flex;
			&>div {
				flex:1;
			}
		}
	}
	&[data-sport-name="basketball"]{
		.m-event-team-wrap{
			.home-team-name,.away-team-name{
				.score{
					em {
						min-width: 35/@rem;
					}
				}
			}
		}
	}
	&[data-sport-name="tennis"]{
		.m-event-team-wrap{
			.home-team-name,.away-team-name{
				.score{
					em {
						min-width: 34/@rem;
					}
				}
			}
		}
	}
	.change-match-overly{
		position: absolute;
		height: 100%;
		left: 0px;
		background: @black;
		opacity: .6;
		z-index: 777;
		width: 100%;
	}
	.change-match{
		outline: none;
		// 注意这里如果用了fixed，ios系统下会整个出问题
		.change-match-content-wrap{
			position: absolute;
			width: 100%;
			left: 0px;
			z-index: 888;
			max-height: 50%;
			overflow: auto;
			.change-match-content{
				padding-bottom: 10/@rem;
				background: @dark;
				.no-data {
					text-align: center;
					.m-icon-exclamation();
					padding: 28/@rem;
					color: @darkGray;
					line-height: 1.5;
					&:before{
						color: @lightGray;
						font-size: 30/@rem;
					}
				}
				dl{
					dt{
						padding: 0 16/@rem;
						color: @darkGray;
						height: 25/@rem;
						line-height: 25/@rem;
						border-bottom: 1px solid fade(@lightGray, 15%);
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					dd{
						padding: 0 16/@rem;
						height: 48/@rem;
						line-height: 48/@rem;
						color:white;
						justify-content: space-between;
						align-items: center;
						&:active{
							background-color: fade(@lightGray, 15%);
						}
						.active{
							color: @dark;
							background-color: @midGreen;
						}
						display: flex;
						&>span{
							display: block;
							flex: 1;
						}
						.time{
							flex: 0 0 auto;
							padding-right: 10/@rem;
							min-width: 24/@rem;
						}
						.team{
							em{
								display: block;
							}
							line-height: 1.5;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
						.set-score,
						.game-score{
							em{
								display: block;
							}
							text-align: right;
							min-width: 24/@rem;
							line-height: 1.5;
							flex: 0 0 auto;
							color: @midGreen;
						}
						border-bottom: 1px solid fade(@lightGray, 15%);
					}
				}
			}
		}
	}
	.event-detail{
		.m-group{
			background-color: #1b1e25;
			border-bottom: 1px solid fade(@lightGray, 15%);
		}
		.m-sport-market-no-data{
			&:before{
				color: fade(@lightGray, 15%);
			}
		}

		.m-sport-market {
			overflow: hidden;
			.m-market {
				.m-market-title{
					color: #FFF;
					border-top: 1px solid #353a45;
				}
				.market-content {
					.m-table-row {
						.m-outcome {
							color: @midGreen;
							background: fade(@thinGreen, 13%);

							&--checked {
								color: @white;
								background: @green;

								&:before{
									color: @white!important;
								}
							}

							&--disabled {
								background: @dimDark;
								color: @grayGreen;
							}

							&--up,
							&--down{
								&:before{
									color: @midGreen;
								}
							}
						}
						// 组合类型的横向和纵向标题
						.m-outcome-combo-title {
							background: rgba(234, 236, 239, 0.15);
							color: @midGray;
							font-size: 12/@rem;
							box-sizing: border-box;
						}
						.m-outcome-combo-column-title{
							background-color: rgba(234, 236, 239, 0.15);
							color: @fogGray;
						}
					}
				}
			}
		}
	}
	.live-match.event-detail {
		background-color: @darker;
		.m-group {
			border-bottom-color: @darker;
		}
		.m-detail-market-default .m-market-title {
			background-color: @darker;
		}
	}
	.live-editor {
		z-index: 501;
		color: @dark;
	}
}
</style>
