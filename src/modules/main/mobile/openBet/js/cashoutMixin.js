export default {
	data() {
		return {
			showCashoutBar: false,
			cashoutBetId: ''
		};
	},
	methods: {
		toggleCashoutBar(event, isShow, id) {
			this.showCashoutBar = isShow;
			this.cashoutBetId = id;
		}
	}
};
