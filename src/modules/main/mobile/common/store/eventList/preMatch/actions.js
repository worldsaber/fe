import detailPush from 'push/betPush';
import { UPDATE_PRODUCT_STATUS } from './mutationTypes';
import '../../../../mockData/preMatch?debug';

export default {
	subProductStatus({ commit, state }) {
		detailPush.sub({
			topic: 'product^3^status',
			pushType: 'GROUP',
			listener: res => {
				if (typeof res === 'string') {
					const data = JSON.parse(res);
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(UPDATE_PRODUCT_STATUS, code);
						}
					}
				}
			}
		});
	},
	unSubProductStatus ({ commit, state }) {
		detailPush.unsub({
			topic: 'product^3^status',
			pushType: 'GROUP'
		});
	},
};
