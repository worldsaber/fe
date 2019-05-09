<template lang="html">
	<div class="m-ad-wrapper">
		<AfCarousel :itemsList = "list" :carouselOps = "ops" v-if = "hasData"></AfCarousel>

		<div class="m-image-wrapper" v-else>
			<img :src="defaultPng" alt="">
		</div>

		<div class="m-ad-loading" v-if="loading">
			<div>
				<i class="m-icon-loading"></i>
			</div>
		</div>
	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import 'packages/carousel';

import '../../../mockData/assist/ad?debug';

const defaultPng = window.country === 'ng' ? require('./ng.jpg') : window.country === 'gh' ? require('./gh.jpg') : require('./ke.jpg');

export default {
	name: 'AdBar',

	data() {
		return {
			list: [],
			ops: {
				indicators: true,
				interval: 5000
			},
			defaultPng,
			loading: false
		};
	},
	computed: {
		hasData() {
			return this.list && (!!this.list.length) || false;
		}
	},
	methods: {
		getData() {
			this.loading = true;
			this.list = [];

			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			t.append('OperId', window.operId);

			const params = {
				adSpots: [{
					spotId: 'updateAd',
					preserve: ''
				}]
			};

			fetch('/promotion/v1/sp/query', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			}).then(res => res.json())
			.then(data => {
				const code = data.bizCode,
					originData = data.data || {};

				let list = originData.adSpots || [];
				list = list.length ? list[0].ads : [];

				if (code === 10000) {
					for (const adItem of list) {
						this.list.push({
							link: adItem.linkUrl,
							img: adItem.imgUrl
						});
					}
				}

				this.loading = false;
			}).catch(err => { // eslint-disable-line
				this.loading = false;
			});
		}
	},
	created() {
		this.getData();

		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			this.getData();
		});
	}
};
</script>
