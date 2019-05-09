import 'utils';
import './index.less';
// 获取所有url参数
let params = URL.getPara(true);
const height = +params.height;
const content = document.querySelector('.page-content');
if (content && height > 0) {
	content.style.height = height + 'px';
}
function init4matchheader() {
	params = params || {};
	if (!params.id) {
		return;
	}
	const config = {
		container: '.score',
		showTitle: false,
		matchId: params.id
	};
	window.SRLive.addWidget({
		name: 'widgets.matchheader',
		config,
		callback: () => {
			document.querySelector('#pageLoading').style.display = 'none';
		}
	});
}
init4matchheader();

function init4matchstats() {
	params = params || {};
	if (!params.id) {
		return;
	}
	const config = {
		/* shared configuration */
		container: '.africa-livetracker',
		showTitle: false,
		matchId: params.id
	};
	window.SRLive.addWidget({
		name: 'widgets.matchstats',
		config
	});
}
init4matchstats();
