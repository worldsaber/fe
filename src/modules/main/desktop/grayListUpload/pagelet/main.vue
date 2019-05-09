<template>
	<div class="m-gray-list-upload">
		<div class="main">
		<template v-if="!loading">
		<div class="back-wrap">
			<i class="m-icon-back" @click="goBack"/>
			<span @click="goBack">Back</span>
		</div>
		<div class="m-block">
			<div class="upload-tip">
				<p>Please upload and submit the required documents below to complete the verification.</p>
				<p>Only accepts <span>JPG/PNG/PDF</span> file formats.</p>
			</div>
			<h1 class="m-title"><span class="m-num">1</span>Identity Document</h1>
			<p class="m-para">Identity card, passport, etc. Please upload photos of all IDs associated with all withdrawal accounts.</p>
			<p class="m-para">Withdrawals will only be posted to the verified accounts.</p>
			<uploader class="m-uploader" :upload="file => uploadFile(file, 'identityList')" v-model="identityList" :beforeSubmit="file => beforeSubmit(file, 'identityList')" :removeFile="i => removeFile(i, 'identityList')" :previewFile="i => previewFile(i, 'identityList')"/>
		</div>
		<div class="m-block">
			<h1 class="m-title"><span class="m-num">2</span>Payment Info</h1>
			<p class="m-para">Please upload photos of cards/accounts for all deposits.</p>
			<uploader class="m-uploader" :upload="file => uploadFile(file, 'paymentList')" v-model="paymentList" :beforeSubmit="file => beforeSubmit(file, 'paymentList')" :removeFile="i => removeFile(i, 'paymentList')" :previewFile="i => previewFile(i, 'paymentList')"/>
		</div>
		<div class="m-block" v-if="needTransRef">
			<h1 class="m-title"><span class="m-num">3</span>Transaction Reference</h1>
			<p class="m-para">Please enter the transaction reference when GT bank or Quickteller is used for deposit. For example 888812343518. Using &apos;,&apos; to separate each reference.</p>
			<div class="m-code-input-wrap">
				<af-input class="m-code-input" v-model="code" placeholder="Transaction Reference Number" @change="codeChange" :maxlength="150" :error="!!codeErr"/>
				<div class="m-code-btn" @click="addCode">
					<i class="icon-plus">+</i>
					<span class="btn-text">ADD</span>
				</div>
			</div>
			<div class="code-error-msg" v-if="codeErr">{{codeErr}}</div>
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
// import { pagePath } from 'config/pageConfig.js';
import uploader from './uploader.vue';
import progressDialog from './progressDialog.vue';
import { splitFileName } from '../lib/util.js';

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
			identityList: [],
			paymentList: [],
			bankList: [],
			loading: false,
			needTransRef: false,
			submitting: false,
			isPreview: false,
			previewUrl: '',
			codeErr: ''
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
	watch: {
		code() {
			if (this.codeErr) {
				this.codeErr = '';
			}
		}
	},
	methods: {
		goBack() {
			window.history.go(-1);
		},
		submit() {
			if (!this.identityList.length) {
				this.$dialog({
					title: null,
					width: 300,
					content: 'Please upload identity documents.',
					button: ['OK']
				});
				return;
			}
			if (!this.paymentList.length) {
				this.$dialog({
					title: null,
					width: 300,
					content: 'Please upload payment info.',
					button: ['OK']
				});
				return;
			}
			if (!this.codeList.length && this.needTransRef) {
				this.$dialog({
					title: null,
					width: 300,
					content: 'Please add transaction reference.',
					button: ['OK']
				});
				return;
			}
			const d = this.$dialog({
				title: null,
				width: 300,
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
				// this.previewUrl = url;
				// this.isPreview = true;
				// this.$nextTick(() => {
				// 	this.fixImage();
				// });
				const downloadEle = document.createElement('a');
				downloadEle.href = url;
				downloadEle.download = `${file.name}.${file.type}`;
				downloadEle.click();
				URL.revokeObjectURL(url);
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
					this.leaveUpload();
				}
			}).catch(e => {
				console.log(e);
				this.loading = false;
				this.$dialog({
					title: null,
					width: 300,
					content: '',
					button: ['OK']
				});
			});
		},
		leaveUpload() {
			// const from = URL.getPara('from') === 'withdraw' ? 'withdraw' : 'transaction';
			// window.location.href = pagePath[from];
			window.history.go(-1);
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
						width: 300,
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
						width: 300,
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
						width: 300,
						content: 'Failed to submit. Please try again.',
						button: ['OK']
					});
				}
				return res;
			}).catch(() => {
				this.submitting = false;
				this.$dialog({
					title: null,
					width: 300,
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
						return;
					}
					const data = JSON.parse(xhr.response || xhr.responseText);
					if (data.bizCode === 10000) {
						const fileObj = {
							file,
							url: data.data || ''
						};
						res(fileObj);
						// this.$toast('Upload Successful');
					}
				};
				xhr.open('POST', `/api/${window.country}/pocket/v1/risks/materials/upload?type=${keyToType[listName]}`, true);
				xhr.send(formData);
				const d = this.$dialog({
					title: null,
					width: 300,
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
					width: 300,
					content: 'Only accepts JPG/PNG/PDF file formats.',
					button: ['OK']
				});
				return false;
			}
			if (file.size > 5 * 1024 * 1024) {
				this.$dialog({
					title: null,
					width: 300,
					content: 'Please upload files no larger than 5MB.',
					button: ['OK']
				});
				return false;
			}
			if (this[listName] && this[listName].length >= 10) {
				this.$dialog({
					title: null,
					width: 300,
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
		addCode() {
			if (!this.code) {
				this.codeErr = 'Please enter valid Transaction Reference';
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
			this.code = '';
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
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-gray-list-upload {
	.back-wrap {
		line-height: 32px;
		line-height: 32px;
		text-align: left;
		font-size: 16px;
		.m-icon-back {
			cursor: pointer;
			.m-icon-back();
			&::before {
				font-size: 16px;
			}
		}
		span {
			cursor: pointer;
		}
	}
	.main {
		margin-top: 20px;
		margin-left: 20px;
		padding: 28px 65px;
		min-height: 500px;
		background: @white;
	}
	.m-block {
		&.submit {
			padding-left: 50px;
			padding-right: 50px;
		}
		&:last-of-type {
			margin-bottom: 0;
		}
		border-top: 1px solid @dimBlack;
		// margin-bottom: 8px;
		padding: 16px;
		padding-right: 150px;
		background: @white;
		.upload-tip {
			margin-bottom: 24px;
			padding: 8px 16px;
			background: #fefee5;
			font-size: 12px;
			color: #cf7a25;
			span {
				font-weight: bold;
			}
		}
		.m-title {
			margin-bottom: 12px;
			line-height: 18px;
			font-size: 14px;
			.m-num {
				margin-right: 7px;
				display: inline-block;
				width: 18px;
				height: 18px;
				text-align: center;
				background: @darker;
				color: @white;
				border-radius: 9px;
				font-size: 12px;
			}
		}
		.m-para {
			margin-bottom: 12px;
			padding-left: 25px;
			color: @dark;
			line-height: 14px;
			font-size: 12px;
		}
		.m-uploader {
			padding-left: 25px;
		}
		.m-upload-btn {
			display: inline-block;
			margin-bottom: 6px;
			.default-btn-wrap {
				display: inline-block;
				padding: 0 12px;
				border: 1px solid @green;
				border-radius: 2px;
				color: @green;
				.icon-plus {
					line-height: 34px;
					font-size: 16px;
				}
				.btn-text {
					line-height: 34px;
					font-size: 12px;
					font-weight: bold;
				}
			}
		}
		.m-code-list {
			list-style: none;
			padding-left: 25px;
			.m-code-item {
				margin-top: 6px;
				padding: 8px 12px;
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
					cursor: pointer;
					.m-icon-close();
					&::before {
						font-size: 12px;
					}
				}
			}
		}
		.m-btn-submit {
			width: 114px;
			padding: 0;
			border-radius: 2px;
			background-color: @green;
			color: @white;
			font-size: 16px;
			height: 48px;
			text-align: center;
			line-height: 48px;
			span {
				line-height: 48px;
				height: 48px;
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
	.code-error-msg {
		padding-left: 25px;
		color: @red;
	}
	.m-code-input-wrap {
		padding-left: 25px;
		padding-right: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: @white;
		.m-code-input {
			flex: 1 1 auto;
			&.m-input-wap-wrapper {
				& .m-input-wap {
					background: @white;
					height: 36px;
					line-height: 36px;
				}
			}
		}
		
		.m-code-btn {
			cursor: pointer;
			flex: 0 0 auto;
			border: 1px solid @green;
			margin-left: 12px;
			height: 34px;
			font-size: 16px;
			background: @white;
			display: inline-block;
			padding: 0 12px;
			border: 1px solid @green;
			border-radius: 2px;
			color: @green;
			.icon-plus {
				line-height: 34px;
				font-size: 16px;
			}
			.btn-text {
				line-height: 34px;
				font-size: 12px;
				font-weight: bold;
			}
		}
	}
}
.m-main {
	background: @lightGray;
}
</style>
