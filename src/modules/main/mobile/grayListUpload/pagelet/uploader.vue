<template>
	<div class="m-uploader-wrap">
		<slot>
			<uploadBtn/>
			<ul class="default-file-list">
				<li class="default-file" @click="preview(i)" v-for="(file, i) in value">
					<img class="file-thumbnails" :src="file.dataURL" v-if="false">
					<div class="file-name">{{file.name}}</div>
					<div class="file-type">.{{file.type}}</div>
					<i class="icon-remove" @click.stop="remove(i)"/>
				</li>
			</ul>
		</slot>
	</div>
</template>

<script>
import uploadBtn from './upload-btn.vue';
import compress from '../lib/compress.js';
import { splitFileName } from '../lib/util.js';

export default {
	components: {
		uploadBtn
	},
	props: {
		value: { // 文件列表
			type: Array,
			'default': () => []
		},
		beforeSubmit: {
			type: Function,
			'default': () => true
		},
		beforeRemove: {
			type: Function,
			'default': () => true
		},
		upload: { // 自定义上传方法，应返回一个Promise
			type: Function,
			'default': () => new Promise()
		},
		removeFile: {
			type: Function,
			'default': () => new Promise()
		},
		previewFile: {
			type: Function,
			'default': () => new Promise()
		}
	},
	data() {
		return {
		};
	},
	methods: {
		addFile(file) {
			if (!this.beforeSubmit(file)) {
				return;
			}
			this.compressFile(file);
		},
		remove(i) {
			this.removeFile(i);
		},
		compressFile(file) {
			compress(file, (file, dataURL) => {
				this.upload(file).then(data => {
					const nameObj = splitFileName(data.file.name);
					const file = {
						file: data.file,
						name: nameObj.name,
						type: nameObj.type,
						url: data.url,
						dataURL
					};
					this.$emit('input', this.value.concat([file]));
				});
			});
		},
		preview(i) {
			this.previewFile(i);
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-uploader-wrap {
	.default-file-list {
		list-style: none;
		.default-file {
			margin-top: 6/@rem;
			padding: 8/@rem 12/@rem;
			background: @fogGray;
			display: flex;
			align-items: center;
			justify-content: center;
			.file-thumbnails {
				flex: 0 0 auto;
				width: 32/@rem;
				height: 32/@rem;
				margin-right: 16/@rem;
			}
			.file-name {
				flex: 0 0 auto;
				max-width: 70%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.file-type {
				flex: 1 1 auto;
				margin-right: 16/@rem;
			}
			.icon-remove {
				flex: 0 0 auto;
				.m-icon-close();
				&::before {
					font-size: 12/@rem;
				}
			}
		}
	}
}
</style>
