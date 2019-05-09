// 设置隐藏属性和改变可见属性的事件的名称
let hidden,
	visibilityChange;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
	hidden = 'hidden';
	visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
	hidden = 'msHidden';
	visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
	hidden = 'webkitHidden';
	visibilityChange = 'webkitvisibilitychange';
}

export default (hide, show) => {
	// 处理页面可见属性的改变
	document.addEventListener(visibilityChange, () => {
		if (document[hidden]) {
			// 隐藏状态
			hide && hide();
		} else {
			// 展示状态
			show && show();
		}
	}, false);
};
