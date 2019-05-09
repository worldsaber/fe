export default {
	getmoduleName: (state, getters) => state.moduleName,
	getErrorInfo: (state, getters) => state.errorInfo,
	remainCount: (state, getters) => state.remainMsgNum,
	smsContent: (state, getters) => state.msgContent,
	smsNumber: (state, getters) => state.smsNumber,
	getAccount: (state, getters) => state.account,
	loading: (state, getters) => state.requesting,
	moduleIndex: (state, getters) => state.modulePath.indexOf(state.moduleName),
	moduleCount: (state, getters) => state.modulePath.length,
	modulePath: (state, getters) => state.modulePath,
};
