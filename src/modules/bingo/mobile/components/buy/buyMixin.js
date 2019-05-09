export default {
	methods: {
		/**
		 * 购买下单
		 * @param  {Number} options.boughtAmount    购买数量
		 * @param  {String} options.goodsId         商品id
		 * @param  {String} options.roundId         期次id
		 * @param  {Number} options.actualPayAmount 真实支付金额(扣除优惠券以后)
		 * @param  {String} options.currency        货币种类
		 * @param  {Object} options.favor           优惠券
		 * * @param  {Array} options.favor.favorInfo    优惠券信息
		 * * * @param  {String} options.favor.favorInfo[0].giftId    优惠券id
		 * @param  {Number} options.sharePrice      每个share的价格
		 * @return {Promise}                        [description]
		 */
		async buy(options = {}) {
			options.actualPayAmount *= 10000;
			options.sharePrice *= 10000;

			try {
				const t = new Headers();
				t.append('Content-Type', 'application/json;charset=UTF-8');
				t.append('OperId', window.operId);

				const res = await fetch('/bingowin/order', {
					method: 'POST',
					body: JSON.stringify(options),
					headers: t
				}).then(response => response.json());

				if (res.login === false) {
					return Promise.reject({
						login: false
					});
				}

				const { bizCode, data, message } = res;

				if (bizCode === 10000) {
					return data;
				}

				return Promise.reject({ bizCode, msg: message });
			} catch (err) {
				console.log('err: ', err); // eslint-disable-line
				return Promise.reject(err);
			}
		}
	}
};
