<template>
	<div class="gallery-wrapper">
		<header>
			<span @click="cancel" class="cancel">Cancel</span>
			<span class="title">Avatar Gallery</span>
		</header>
		<template v-if="pageLoading">
			<section>
				<div class="avatar" v-for="i in 28" :key="i"></div>
			</section>
			<div class="loading-avatar">
				<i class="circle"></i>
				<p>Loading gallery...</p>
			</div>
		</template>
		<template v-else-if="pageError">
			<section class="page-err">
				<i class="notice"></i>
				<p>Failed to Load Gallery</p>
				<div class="reload" @click="reloadData">Reload</div>
			</section>
		</template>
		<template v-else>
			<section>
				<div
					:class="['avatar',{'checked':i===selection}]"
					v-for="(avatar,i) in avatars"
					:key="i"
					@click="select(i)"
				>
					<i :class="{'check':i===selection}"></i>
					<img :src="`//s.sporty.net/${avatar}`">
				</div>
			</section>
			<div class="save">
				<AfButton extraType="primary" :loading="btnLoading" @click.prevent="saveAvatar">
					<template v-if='!btnLoading'>Save</template>
					<template v-else>Loading...</template>
				</AfButton>
			</div>
		</template>
	</div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { UPDATE_BASE_ACCOUNT_INFO } from 'store/me/mutationTypes';
import AfButton from 'packages/button/button.vue';

export default {
	data() {
		return {
			avatars: [],
			selection: 0,
			curUrl: '',
			btnLoading: false,
			pageLoading: true,
			pageError: false
		};
	},
	model: {
		prop: 'oldAvatar',
		event: 'update'
	},
	props: ['oldAvatar'],
	components: {
		AfButton
	},
	created() {
		this.getAvatars();
	},
	methods: {
		...mapActions('me', ['quanziLogin']),
		...mapMutations('me', {
			updateAccountInfo: UPDATE_BASE_ACCOUNT_INFO
		}),
		cancel() {
			this.$emit('back2Me');
		},
		reloadData() {
			this.getAvatars();
		},
		getAvatars(appId = 'common') {
			this.pageLoading = true;
			const params = [{
				appId,
				namespace: 'application',
				operId: {
					254: 1,
					234: 2,
					233: 3
				}[window.countryCode],
				configKey: 'default_avatars',
			}];

			fetch('/common/config/query', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				body: JSON.stringify(params),
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const data = res.data || [];
					const avatarObj = JSON.parse(data[0].configValue);
					avatarObj.map(item => this.avatars.push(item.url));
					this.selection = this.avatars.indexOf(this.oldAvatar);
					this.pageLoading = false;
				} else {
					this.pageLoading = false;
					this.pageError = true;
				}
			})
			.catch(e => {
				this.pageLoading = false;
				this.pageError = true;
				console.log(e);
			});
		},
		select(i, url) {
			this.selection = i;
			this.curUrl = url;
		},
		saveAvatar() {
			if (this.btnLoading) return;
			this.btnLoading = true;
			const newAvatar = this.avatars[this.selection];
			fetch('patron/account/info/avatar', {
				method: 'PUT',
				body: {
					avatarUrl: newAvatar
				},
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					this.btnLoading = false;
					this.updateAccountInfo({
						avatar: newAvatar
					});
					this.$emit('back2Me', {
						// newAvatar
					});
					this.quanziLogin();
					this.$emit('update', newAvatar);
					// this.$emit('update:oldAvatar', newAvatar);
					this.$toast('Avatar Saved');
				} else {
					this.btnLoading = false;
					this.$toast('Failed to Upload Avatar');
				}
			})
			.catch(e => {
				this.btnLoading = false;
				this.$toast('Failed to Upload Avatar');
			});
		}
	}
};
</script>

<style lang="less">
	@import 'base/styles/variable.less';
	@import 'base/styles/mixin.less';
	@import 'base/styles/icon.less';

.gallery-wrapper{
	min-height: 100vh;
	position: relative;
	z-index: 10;

	.loading-avatar {
		width: 128/@rem;
		height: 128/@rem;
		border-radius: 4/@rem;
		background: #1b1e25;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		i {
			top: 45%;
			left: 50%;
			position: absolute;
			margin-left: -15/@rem;
			margin-top: -15/@rem;
			.m-icon-loading-circle();
			animation: circles 1s infinite;
			animation-timing-function: linear;
			&:before{
				height: 30/@rem;
				width: 30/@rem;
				line-height: 1;
				font-size: 30/@rem;
				color: #32ce62;
			}
		}
		p {
			font-size: 14/@rem;
			  color: #fff;
			  position: absolute;
			  bottom: 13/@rem;
			  left: 10.5/@rem;
		}
	}
	.page-err {
		display: block;
		margin: 56/@rem auto;
		text-align: center;
		.notice {

			.m-icon-exclamation();
			&:before {
				font-size: 36/@rem;
				color: #dcdee5;
				margin: 0 auto;
			}
		}
		p {
			color: #9ca0ab;
			margin: 12/@rem auto 24/@rem;
		}
		.reload {
			width: 92/@rem;
			height: 36/@rem;
			line-height: 36/@rem;
			margin: 0 auto;
			border-radius: 2/@rem;
			border: solid 1/@rem #0d9737;
			font-size: 14/@rem;
			font-weight: bold;
			color: #0d9737;
		}
	}
	header {
		height: 48/@rem;
		line-height: 48/@rem;
		background: #353a45;
		color: #fff;
		.cancel {
			font-size: 14/@rem;
			margin-left: 16/@rem;
			margin-right: 70/@rem;
		}
		.title {
			font-size: 16/@rem;
  			font-weight: bold;
		}
	}
	section {
		padding-top: 12/@rem;
		padding-bottom: 60/@rem;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		.avatar {
			width: 60/@rem;
			height: 60/@rem;
			margin: 12/@rem;
			line-height: 60/@rem;
			border-radius: 30/@rem;
			background-color: #eaecef;
			position: relative;
			img {
				width: 59/@rem;
				height: 59/@rem;
				border-radius: 30/@rem;
			}
			.check {
				position: absolute;
				top: 22/@rem;
				left:40/@rem;
				color: #1b963c;
				font-size: 10/@rem;
				.m-icon-success-bg();
				&:before {
					width: 10/@rem;
					height: 10/@rem;
					border-radius: 5/@rem;
					background: #fff;
				}
			}
		}
		.checked {
			border: 1/@rem solid #0d9737;
		}
	}
	.save {
		height: 48/@rem;
		width: 100%;
		position: fixed;
		bottom: 0;
		line-height: 48/@rem;
		text-align: center;
		background-color: #0d9737;
		color: #fff;
		font-size: 16/@rem;
	}
	.m-footer {
		display: none;
	}
}


</style>
