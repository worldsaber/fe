<template lang="html">
	<canvas id="canvas"></canvas>
</template>

<script>
import ImageMaker from 'packages/ImageMaker'
import getOptions from 'components/share/sharePics/quoteOptions.js'
import upload from 'utils/upload';

export default {
	name: 'MakeImgDemo',
	data() {
		return {
			ins: null
		}
	},
	methods: {
		async drawImg () {
			const options = getOptions({
				selector: '#canvas',
				winnings: '1,000,0000.00'
			})
			this.ins = new ImageMaker(options)
			try {
				await this.ins.render();
			} catch (err) {
				console.log('>>', err);
			}
		},
		async uploadPic () {
			// const { orderId } = this;
			const orderId = '181102030638ord86417763';
			if (!this.ins) return;

			const url = `/api/${window.country}/orders/share/uploadSharePics/${orderId}`;

			try {
				const fileData = await this.ins.toBlob('image/jpeg', 0.8);
				upload(url, {
					name: 'file',
					file: fileData,
					fileName: 'share.png'
				});
			} catch (err) {
				console.log(err); // eslint-disable-line
			}
		},
	},
	async mounted() {
		await this.drawImg();
		this.uploadPic();
	}
};
</script>
