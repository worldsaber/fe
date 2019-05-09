<template>
	<div class="m-gray-list-upload">
		<div class="main" v-loading="loading">
		<template v-if="!loading">
		<navBar/>
		<div class="tips-wrap">
			<p class="upload-tip">Please upload and submit the required documents below to complete the verification.</p>
			<p class="upload-tip">Only accepts <span>JPG/PNG/PDF</span> file formats.</p>
		</div>
		<div class="m-block" ref="identity">
			<h1 class="m-title"><span class="m-num">1</span>Identity Document</h1>
			<p class="m-para">Identity card, passport, etc. Please upload photos of all IDs associated with all withdrawal accounts.</p>
			<p class="m-para">Withdrawals will only be posted to the verified accounts.</p>
			<uploader class="m-uploader" :upload="file => uploadFile(file, 'identityList')" v-model="identityList" :beforeSubmit="file => beforeSubmit(file, 'identityList')" :removeFile="i => removeFile(i, 'identityList')" :previewFile="i => previewFile(i, 'identityList')"/>
		</div>
		<div class="m-block" ref="payment">
			<h1 class="m-title"><span class="m-num">2</span>Payment Info</h1>
			<p class="m-para">Please upload photos of cards/accounts for all deposits.</p>
			<uploader class="m-uploader" :upload="file => uploadFile(file, 'paymentList')" v-model="paymentList" :beforeSubmit="file => beforeSubmit(file, 'paymentList')" :removeFile="i => removeFile(i, 'paymentList')" :previewFile="i => previewFile(i, 'paymentList')"/>
		</div>
		<div class="m-block" v-if="needTransRef" ref="reference">
			<h1 class="m-title"><span class="m-num">3</span>Transaction Reference</h1>
			<p class="m-para">Please enter the transaction reference when GT bank or Quickteller is used for deposit. For example 888812343518. Using &apos;,&apos; to separate each reference.</p>
			<div class="m-uploader m-upload-btn">
				<div class="default-btn-wrap" @click="inputCode">
					<i class="icon-plus">+</i>
					<span class="btn-text">ADD</span>
				</div>
			</div>
			<ul class="m-code-list">
				<li class="m-code-item" v-for="(code, i) in codeList">
					<div class="num">{{code}}</div>
					<i class="m-icon-close" @click="removeCode(i)"/>
				</li>
			</ul>
		</div>
		<div class="m-block">
			<h1 class="m-title"><span class="m-num">{{needTransRef ? 4 : 3}}</span>Bank Statement (Optional)</h1>
			<uploader class="m-uploader" :upload="file => uploadFile(file, 'bankList')" v-model="bankList" :beforeSubmit="file => beforeSubmit(file, 'bankList')" :removeFile="i => removeFile(i, 'bankList')" :previewFile="i => previewFile(i, 'bankList')"/>
		</div>
		<div class="m-block submit">
			<afButton class="m-btn-submit" @click="submit" :loading="submitting">Submit</afButton>
		</div>
		</template>
		</div>
		<template v-if="isInputCode">
			<div class="m-overlay" @click="overlayClick"/>
			<form class="m-code-input-wrap">
				<af-input ref="referenceInput" class="m-code-input" placeholder="Transaction Reference Number" v-model="code" @change="codeChange" :maxlength="150"/>
				<af-button @click.prevent="addCode" :class="['m-code-btn', {'disabled': code === ''}]">Add</af-button>
			</form>
		</template>
		<template v-if="isPreview">
			<div class="m-overlay"/>
			<div class="m-preview" @click="isPreview = false">
				<img ref="previewImg" :src="previewUrl">
			</div>
		</template>
	</div>
</template>

<script>
import { AfInput } from 'components/input';
import navBar from 'components/navbar';
import appCore from 'appCore';
import { isInApp } from 'appCore/util.js';
// import { appPath } from 'config/appPagePath';
// import { pagePath } from 'config/pageConfig';
import uploader from './pagelet/uploader.vue';
import progressDialog from './pagelet/progressDialog.vue';
import { splitFileName } from './lib/util.js';

const typeToKey = {
	1: 'identityList',
	2: 'paymentList',
	3: 'bankList'
};
const keyToType = {
	identityList: 1,
	paymentList: 2,
	bankList: 3
};

export default {
	name: 'grayListUpload',
	components: {
		navBar,
		uploader,
		AfInput,
		progressDialog
	},
	data () {
		return {
			currentTab: '',
			code: '',
			codeList: [],
			isInputCode: false,
			identityList: [],
			paymentList: [],
			bankList: [],
			loading: false,
			needTransRef: false,
			submitting: false,
			isPreview: false,
			previewUrl: ''
		};
	},
	created() {
		this.getMaterials();
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		if (loading) {
			loading.style.display = 'none';
		}
	},
	methods: {
		submit() {
			if (!this.identityList.length) {
				this.$dialog({
					title: null,
					content: 'Please upload identity documents.',
					button: ['OK']
				});
				this.$refs.identity.scrollIntoView();
				return;
			}
			if (!this.paymentList.length) {
				this.$dialog({
					title: null,
					content: 'Please upload payment info.',
					button: ['OK']
				});
				this.$refs.payment.scrollIntoView();
				return;
			}
			if (!this.codeList.length && this.needTransRef) {
				this.$dialog({
					title: null,
					content: 'Please add transaction reference.',
					button: ['OK']
				});
				this.$refs.reference.scrollIntoView();
				return;
			}
			const d = this.$dialog({
				title: null,
				content: 'Once the documents are submitted, they cannot be modified. Please check carefully before submitting.',
				button: ['CANCEL', 'CONTINUE']
			});
			d.onBtnClick(val => {
				if (val === 1) {
					this.putMaterials();
				}
			});
		},
		removeFile(i, listName) {
			const file = this[listName][i];
			this.deleteMaterials(file, listName, i);
		},
		previewFile(i, listName) {
			const file = this[listName][i];
			if (['jpg', 'jpeg', 'png'].indexOf(file.type.toLowerCase()) < 0) {
				return;
			}
			const headers = new Headers();
			headers.append('content-type', 'application/json');
			return fetch('/pocket/v1/risks/materials/download', {
				method: 'post',
				headers,
				body: JSON.stringify({
					url: file.url,
					type: keyToType[listName]
				})
			}).then(res => res.blob()).then(res => {
				const url = URL.createObjectURL(res);
				console.log(url);
				this.previewUrl = url;
				this.isPreview = true;
				this.$nextTick(() => {
					this.fixImage();
				});
			});
		},
		fixImage() {
			const img = this.$refs.previewImg;
			img.onload = () => {
				const w = img.width;
				const h = img.height;
				const clientWidth = document.body.clientWidth;
				const clientHeight = document.body.clientHeight;
				let ratio;
				if (w > clientWidth || h > clientHeight) {
					ratio = clientWidth / w < clientHeight / h ? clientWidth / w : clientHeight / h;
					img.width = ratio * w;
					img.height = ratio * h;
				}
			};
		},
		getMaterials() {
			this.loading = true;
			return fetch('/pocket/v1/risks/materials').then(res => res.json()).then(res => {
				this.loading = false;
				if (res.bizCode === 10000) {
					this.needTransRef = res.data.needTransRef;
					this.identityList = [];
					this.paymentList = [];
					this.bankList = [];
					const appendixFiles = res.data.appendixFiles;
					appendixFiles.forEach(file => {
						const nameObj = splitFileName(file.name);
						this[typeToKey[file.type]].push({
							name: nameObj.name,
							type: nameObj.type,
							url: file.url
						});
					});
					this.codeList = res.data.transactionReferences;

					// this.$nextTick(() => {
					// 	this.loadFiles();
					// });
				} else {
					// this.$dialog({
					// 	title: null,
					// 	content: res.message,
					// 	button: ['OK']
					// });
					// 这里bizCode不是10000暂时就认为无对应权限
					this.leaveUpload();
				}
			}).catch(e => {
				console.log(e);
				this.loading = false;
				this.$dialog({
					title: null,
					content: '',
					button: ['OK']
				});
			});
		},
		leaveUpload() {
			// const from = URL.getPara('from') === 'withdraw' ? 'withdraw' : 'transaction';
			if (isInApp()) {
				if (appCore.getAppName() === 'sportybet') {
					appCore.sportybet.ready(AFJsApi => {
						if (!AFJsApi) {
							return;
						}
						AFJsApi.common.postNotification({
							name: 'com.sportybet.action.JS_EVENT',
							params: {
								eventName: 'finishWeb'
							}
						});
					});
				}
			} else {
				window.history.go(-1);
			}
		},
		loadFiles() {
			['identityList', 'paymentList', 'bankList'].forEach(key => {
				this[key].forEach((file, i) => {
					this.loadFile(file, this[key], i, key);
				});
			});
		},
		loadFile(file, list, index, listName) {
			const headers = new Headers();
			headers.append('content-type', 'application/json');
			return fetch('/pocket/v1/risks/materials/download', {
				method: 'post',
				headers,
				body: JSON.stringify({
					url: file.url,
					type: keyToType[listName]
				})
			}).then(res => {
				console.log(res);
			});
		},
		constructData(items) {
			const transactionReferences = items;
			return {
				transactionReferences
			};
		},
		deleteMaterials(item, listName, i) {
			const headers = new Headers();
			headers.append('content-type', 'application/json');
			return fetch('/pocket/v1/risks/materials', {
				method: 'delete',
				headers,
				body: JSON.stringify({
					url: item.url,
					type: keyToType[listName]
				})
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					this[listName].splice(i, 1);
				} else {
					this.$dialog({
						title: null,
						content: res.message || 'Failed to delete. Please try again.',
						button: ['OK']
					});
				}
			});
		},
		putMaterials() { // 用来提交transaction reference和改变后台状态
			const riskAppendixInfo = this.constructData(this.codeList);
			const headers = new Headers();
			headers.append('content-type', 'application/json');
			this.submitting = true;
			return fetch('/pocket/v1/risks/materials', {
				method: 'PUT',
				headers,
				body: JSON.stringify({
					riskAppendixInfo
				})
			}).then(res => res.json()).then(res => {
				this.submitting = false;
				if (res.bizCode === 10000) {
					const d = this.$dialog({
						title: 'Submission Successful',
						content: 'The information is currently being reviewed and cannot be changed. It\'ll take up to 3 business days. Please wait patiently.',
						button: ['OK']
					});
					d.onBtnClick(() => {
						this.leaveUpload();
					});
				} else {
					this.$dialog({
						title: null,
						content: 'Failed to submit. Please try again.',
						button: ['OK']
					});
				}
				return res;
			}).catch(() => {
				this.submitting = false;
				this.$dialog({
					title: null,
					content: 'Failed to submit. Please try again.',
					button: ['OK']
				});
			});
		},
		uploadFile(file, listName) {
			return new Promise((res, rej) => {
				const xhr = new XMLHttpRequest();
				if (xhr.upload) {
					xhr.upload.onprogress = e => {
						d.$content.$emit('change', (e.loaded / e.total * 100).toFixed(2));
					};
				}
				const formData = new window.FormData();
				console.log(file);
				formData.append('file', file, file.name);
				xhr.onload = () => {
					this.$dialog();
					if (xhr.status < 200 || xhr.status >= 300) {
						rej();
						this.$dialog();
						this.$dialog({
							title: null,
							content: 'Failed to submit. Please try again.',
							button: ['OK']
						});
						return;
					}
					const data = JSON.parse(xhr.response || xhr.responseText);
					if (data.bizCode === 10000) {
						const fileObj = {
							file,
							url: data.data || ''
						};
						res(fileObj);
						this.$toast('Upload Successful');
					}
				};
				xhr.onerror = () => {
					this.$dialog();
					this.$dialog({
						title: null,
						content: 'Failed to submit. Please try again.',
						button: ['OK']
					});
				};
				xhr.open('POST', `/api/${window.country}/pocket/v1/risks/materials/upload?type=${keyToType[listName]}`, true);
				xhr.send(formData);
				const d = this.$dialog({
					title: null,
					content: progressDialog,
					button: []
				});
				d.onMounted(() => {
					d.$content.$on('cancel', () => {
						xhr.abort();
						rej();
						this.$dialog();
					});
				});
			});
		},
		beforeSubmit(file, listName) {
			if (!/jpg|jpeg|png|pdf/.test(file.type)) {
				this.$dialog({
					title: null,
					content: 'Only accepts JPG/PNG/PDF file formats.',
					button: ['OK']
				});
				return false;
			}
			if (file.size > 5 * 1024 * 1024) {
				this.$dialog({
					title: null,
					content: 'Please upload files no larger than 5MB.',
					button: ['OK']
				});
				return false;
			}
			if (this[listName] && this[listName].length >= 10) {
				this.$dialog({
					title: null,
					content: 'Please do not upload more than 10 files.',
					button: ['OK']
				});
				return false;
			}
			return true;
		},
		codeChange() {
			this.code = this.code.replace(/\s/, '');
		},
		inputCode() {
			this.isInputCode = true;
			this.$nextTick(() => {
				const input = this.$refs.referenceInput;
				input.$refs.input && input.$refs.input.focus();
			});
		},
		addCode() {
			if (!this.code) {
				this.$toast('Please enter valid Transaction Reference');
				this.$nextTick(() => {
					const input = this.$refs.referenceInput.$refs.input;
					input && input.focus();
				});
				return;
			}
			const validCodes = [];
			this.code.split(',').forEach(code => {
				if (code) {
					validCodes.push(code);
				}
			});
			const newList = this.codeList.concat(validCodes);
			this.codeList = newList;
			this.overlayClick();
			// this.code = '';
		},
		removeCode(i) {
			this.codeList.splice(i, 1);
			// const copyList = JSON.parse(JSON.stringify(this.codeList));
			// copyList.splice(i, 1);
			// this.putMaterials(copyList).then(res => {
			// 	if (res.bizCode === 10000) {
			// 		this.codeList.splice(i, 1);
			// 	}
			// });
		},
		overlayClick() {
			this.isInputCode = false;
			this.code = '';
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-gray-list-upload {
	
	.main {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		min-height: 100%;
		background-color: @lightGray;
		overflow: auto;
	}
	.tips-wrap {
		padding: 8/@rem 15/@rem;
		background: #fefee5;
		font-size: 12px;
		color: #cf7a25;
		.upload-tip {
			line-height: 14/@rem;
			font-size: 12/@rem;
			span {
				font-weight: bold;
			}
		}
	}
	.m-block {
		&.submit {
			padding-left: 50/@rem;
			padding-right: 50/@rem;
		}
		&:last-of-type {
			margin-bottom: 0;
		}
		margin-bottom: 8/@rem;
		padding: 16/@rem;
		background: @white;
		.m-title {
			margin-bottom: 12/@rem;
			line-height: 18/@rem;
			font-size: 14/@rem;
			.m-num {
				margin-right: 7/@rem;
				display: inline-block;
				width: 18/@rem;
				height: 18/@rem;
				text-align: center;
				background: @darker;
				color: @white;
				border-radius: 9/@rem;
				font-size: 12/@rem;
			}
		}
		.m-para {
			margin-bottom: 12/@rem;
			padding-left: 25/@rem;
			color: @dark;
			line-height: 14/@rem;
			font-size: 12/@rem;
		}
		.m-uploader {
			padding-left: 25/@rem;
		}
		.m-upload-btn {
			display: inline-block;
			margin-bottom: 6/@rem;
			.default-btn-wrap {
				display: inline-block;
				padding: 0 12/@rem;
				border: 1px solid @green;
				border-radius: 2/@rem;
				color: @green;
				.icon-plus {
					line-height: 34/@rem;
					font-size: 16/@rem;
				}
				.btn-text {
					line-height: 34/@rem;
					font-size: 12/@rem;
					font-weight: bold;
				}
			}
		}
		.m-code-list {
			list-style: none;
			padding-left: 25/@rem;
			.m-code-item {
				margin-top: 6/@rem;
				padding: 8/@rem 12/@rem;
				background: @fogGray;
				display: flex;
				align-items: center;
				justify-content: center;
				.num {
					flex: 1 1 auto;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.m-icon-close {
					flex: 0 0 auto;
					.m-icon-close();
					&::before {
						font-size: 12/@rem;
					}
				}
			}
		}
		.m-btn-submit {
			width: 100%;
			padding: 0;
			border-radius: 2/@rem;
			background-color: @green;
			color: @white;
			font-size: 16/@rem;
			height: 48/@rem;
			text-align: center;
			line-height: 48/@rem;
			span {
				line-height: 48/@rem;
				height: 48/@rem;
			}
			&:active {
				background-color: @darkGreen;
			}
		}
	}
	.m-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: @dark;
		opacity: 0.2;
		z-index: 10;
	}
	.m-preview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 11;
		overflow: auto;
		img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.m-code-input-wrap {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 11;
		height: 52/@rem;
		padding: 8/@rem 16/@rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		background: @white;
		.m-code-input {
			flex: 1 1 auto;
			&.m-input-wap-wrapper {
				border: none;
				& .m-input-wap {
					background: @fogGray;
					height: 36/@rem;
					line-height: 36/@rem;
				}
			}
		}
		
		.m-code-btn {
			flex: 0 0 auto;
			margin-left: 6/@rem;
			height: 36/@rem;
			color: @white;
			font-size: 16/@rem;
			background: @green;
			border: none;
			&.disabled {
				background: @darkGray;
			}
		}
	}
}
</style>
