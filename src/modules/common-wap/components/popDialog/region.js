import { LS } from 'storage';
import dialog from 'components/dialog';
import ChangeRegion from './pagelet/changeRegion';

const changeRegion = () => {
	const pathname = location.pathname;
	let reqBase = /\/?([^\/]+)\//.exec(pathname);

	reqBase = reqBase && reqBase[1] || null; // eslint-disable-line

	if (!reqBase) {
		return;
	}

	// ip与当前链接不符合,且本设备从未提示过，才弹
	const region = LS.get('wap-set-region');
	if (window.ipCountry !== reqBase && !region) {
		dialog({
			title: null,
			'class': 'm-region-pop',
			content: ChangeRegion,
			button: []
		});
	}
};

export default changeRegion;
