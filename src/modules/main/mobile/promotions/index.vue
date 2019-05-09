<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<MainSection slot="mid" :list="list"></MainSection>
	</Layout>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat';
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainSection from './pagelet/index';
import '../mockData/promotions/index?debug';

export default {
	name: 'transaction',
	components: {
		Layout,
		MainSection
	},
	data () {
		return {
			list: []
		};
	},
	created () {
		this.getList().then(() => {
			this.pageLoading(false);
		}).catch(() => {
			this.pageLoading(-1);
		});
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		getList () {
			return new Promise((resolve, reject) => {
				fetch('/promotion/v1/activities', {
					method: 'GET',
					body: {
						classify: 1
					}
				}).then(res => res.json())
				.then((data = {}) => {
					const code = data.bizCode;
					if (code === 10000) {
						this.formatDataList(data.data.entityList);
						resolve(true);
					}
					reject(false);
				}).catch(() => {
					reject(false);
				});
			});
		},
		formatDataList (list = []) {
			const len = list.length;
			for (let i = 0; i < len; i++) {
				list[i].showStartDate = dateFormat.format(list[i].activityStartTime, 'DD/MM/YYYY');
				list[i].showEndDate = dateFormat.format(list[i].activityEndTime, 'DD/MM/YYYY');
			}
			this.list = list;
		}
	}
};
</script>
