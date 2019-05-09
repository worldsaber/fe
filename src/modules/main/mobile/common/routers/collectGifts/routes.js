import CollectGiftsResult from '../../../activity/collectGifts/pages/result.vue';
import CollectGifts from '../../../activity/collectGifts/pages/index.vue';
import SmsResult from '../../../activity/collectGifts/pages/sms.vue';

const routes = [
	// 抢红包活动领取结果页
	{
		path: '/result/:giftId',
		name: 'result',
		component: CollectGiftsResult,
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/sms',
		name: 'smsResult',
		component: SmsResult
	},
	{
		path: '*',
		name: 'collectGifts',
		component: CollectGifts
	}
];

export default routes;
