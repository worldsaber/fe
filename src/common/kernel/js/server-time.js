// 初始化时间靠页面打点记录：[当前本地时间、服务器时间ms、nigix替换的服务器时间ms]
const _it = window._it;
const initTime = _it && _it.length === 3 ? _it : [new Date(), +new Date(), ''];
const parseDate = date => {
	let t = date;
	if (!t) {
		t = '';
	}
	return +new Date(/^\d+$/.test(t) ? +t : Date.parse(t) || 0);
};
const Time = {
	connectTime: window.performance && window.performance.timing ? window.performance.timing.connectStart || 0 : 0,
	serverInitTime: parseDate(initTime[2].replace(/\D/g, '') || initTime[1]),
	localInitTime: parseDate(initTime[0]),
	getServerTime: () => {
		// 如果connectTime存在并且比serverTime早，则修正serverTime
		const pageLoadTime = this.localInitTime - this.connectTime;
		let	serverTime = this.serverInitTime + (+new Date());
		serverTime -= this.localInitTime;
		return new Date(this.connectTime > 0 && pageLoadTime > 0 ? serverTime + pageLoadTime : serverTime);
	}
};

export default function getServerTime () {
	return Time.getServerTime();
}
