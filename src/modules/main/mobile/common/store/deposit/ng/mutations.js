import {
	UPDATE_DISPLAY_MSG
} from './mutationTypes';

export default {
	[UPDATE_DISPLAY_MSG](state, msg) {
		state.displayMsg = msg;
	}
};
