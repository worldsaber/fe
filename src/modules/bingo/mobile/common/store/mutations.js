// import { isEmptyObject, formatNumber, objType } from 'utils';
// import * as type from './mutationTypes';
import { UPDATE_CAROUSEL, UPDATE_BRAODCAST_LIST } from './mutationTypes';

export default {
	[UPDATE_CAROUSEL](state, payload) {
		state.carouselList = payload;
	},
	[UPDATE_BRAODCAST_LIST](state, payload) {
		state.broadcastList = payload;
	}
};
