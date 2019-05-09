<template>
	<div class="m-uc-wrapper">	
	<template v-if="page==='me'">
		<topNavBar></topNavBar>
		<a :href="landingPage">
			<img v-if="!emialHasBeenVerified" :src="imgPath" class="banner">
		</a>
		<ul class="m-ac-info-wrap">
			<li class="m-ac-user" @click="changeAvatar">
				<em class="avatar">
					<img :src="`//s.sporty.net/${avatar}`">
				</em>
				<em>{{accountInfo.phone}}</em>
				<span class="change-avatar">Change Avatar</span>
			</li>
			<li v-for="item in itemsMap" :key="item.key" @click="modifyItem(item)">
				<em>{{item.label}}</em>
				<i v-if="item.label === 'Email' && emialHasBeenVerified" class="verify">(Verified)</i>
				<!-- <span v-if="item.key === 'nickname' && !accountInfo[item.key]">Add a Nickname</span> -->
				<span :class="['selected',{'verified':emialHasBeenVerified&&item.key==='email'},{'edit':!accountInfo[item.showValue ? item.showValue : item.key]}]">{{accountInfo[item.showValue ? item.showValue : item.key]||'Edit'}}</span>
				<select v-if="item.key === 'gender'" v-model="gender" v-show="!showPopDiv">
					<option value="1">Male</option>
					<option value="2">Female</option>
				</select>
			</li>
		</ul>
		<template v-if="showPopDiv">
			<editFormItem v-if="showPopItem === 'basic'"  @backEvent="backHandler" :sendData="sendData"></editFormItem>
			<birthItem v-if="showPopItem === 'birthday'" @backEvent="backHandler" :sendData="sendData"></birthItem>
			<passwordItem v-if="showPopItem === 'password'"></passwordItem>
			<stateList v-if="showPopItem === 'stateList'" @backEvent="backHandler" :sendData="sendData"/>
			<verifiedEmailNote v-if="showPopItem === 'verifiedEmailNote'" :sendData="sendData" @backEvent="backHandler"/>
		</template>
	</template>
	<template v-if="page==='gallery'">
		<!-- <Gallery @back2Me="toMe" :oldAvatar="avatar"/> -->
		<Gallery @back2Me="toMe" v-model="avatar"/>
		<!-- <Gallery @back2Me="toMe" :oldAvatar.sync="avatar"/> -->
	</template>
</div>
</template>
<script>
import topNavBar from 'components/navbar';
import { pagePath } from 'config/pageConfig';
import popMsg from '../../deposit/ke/js/popMsg';
import { saveAccountItem, itemsMap } from '../js/helper';
import editFormItem from './formItem';
import birthItem from './birthday';
import passwordItem from './password';
import stateList from './stateList';
import verifiedEmailNote from './verifiedEmailNote';
import Gallery from './avatarGallery';

const bannerImgKe = require('../../activity/getEmail/image/banner-ke.jpg');
const bannerImgNg = require('../../activity/getEmail/image/banner-ng.jpg');
const bannerImgGh = require('../../activity/getEmail/image/banner-gh.jpg');

const countryMap = {
	ke: bannerImgKe,
	ng: bannerImgNg,
	gh: bannerImgGh
};

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
		editFormItem,
		birthItem,
		passwordItem,
		stateList,
		Gallery,
		verifiedEmailNote
	},
	props: ['accountInfoFromParent'],
	watch: {
		accountInfoFromParent (val) {
			this.accountInfo = val;
			this.avatar = this.accountInfo.avatar;
		},
		gender (val) {
			this.accountInfo.gender = val;
			this.accountInfo.genderStr = ['Male', 'Female'][+val - 1];
			saveAccountItem({
				key: 'gender',
				value: this.gender
			}).then(code => {
				if (code === 10000) {
					this.showToast('Succeeded');
					window.setTimeout(() => {
						this.$emit('backEvent', {
							key: this.sendData.key,
							value: this.key
						});
					}, 2000);
				}
				this.loading = false;
			});
		}
	},
	data () {
		return {
			landingPage: `${pagePath.home}ops/verify`,
			itemsMap,
			showPopDiv: false,  // 是否显示各选项修改的浮层
			showPopItem: '',	// 标记显示哪个选项的修改浮层值有：basic(修改姓名。邮箱)、birthday（生日）、password（密码）
			accountInfo: {},
			sendData: {},
			gender: '',
			home: pagePath.home, // me页url
			page: 'me',
			avatar: null,
			emialHasBeenVerified: true,
			email: '',
			country: window.country,
			imgPath: countryMap[window.country]
		};
	},
	created() {
		fetch('/patron/mail/verify/check').then(res => res.json()).then(res => {
			if (res.bizCode === 10000) {
				if (res.data === true) {
					this.emialHasBeenVerified = true;
				} else this.emialHasBeenVerified = false;
			}
		}).catch(e => console.log(e));
	},
	methods: {
		backHandler (data) {
			this.showPopDiv = false;
			if (typeof data === 'object') {
				this.accountInfo[data.key] = data.value;
				if (data.showKey) {
					this.accountInfo[data.showKey] = data.showValue;
				}
			}
			document.querySelector('.m-main-mid').scrollTop = 0;
		},
		changeAvatar() {
			this.page = 'gallery';
			this.$emit('hideFooter');
		},
		toMe(data) {
			this.page = 'me';
			// if (data) this.avatar = data.newAvatar;
			this.$emit('showFooter');
		},
		// 各选项点击事件
		modifyItem (item) {
			if (item.key === 'gender') {
				return;
			}
			if (item.key === 'birthday') {
				this.showPopItem = 'birthday';
			} else if (item.key === 'birthday') {
				this.showPopItem = 'birthday';
			} else if (item.key === 'password') {
				this.showPopItem = 'password';
			} else if (item.key === 'state') {
				this.showPopItem = 'stateList';
			} else if (item.key === 'email') {
				if (!this.emialHasBeenVerified) {
					this.showPopItem = 'basic';
				} else {
					this.showPopItem = 'verifiedEmailNote';
				}
			} else {
				this.showPopItem = 'basic';
			}
			if (item.key !== 'password') {
				item.value = this.accountInfo[item.key];
				this.sendData = item;
			}
			this.showPopDiv = true;
		}
	}
};
</script>

<style lang="less">
@import "../index.less";
.m-uc-wrapper {
	.banner {
		width: 100%;
	}
}
</style>
