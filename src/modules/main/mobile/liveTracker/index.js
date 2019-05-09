import 'core/core';
import 'base/base';
import { typeList, widgetTypes } from 'packages/liveMatchTracker/widgetsConfig.js';
import { sportsConfigById } from 'config/sports';
import 'utils/class.js';
import './index.less';

// 记录用户点击的type值
const APP_SESSION_TYPE = 'app_stat_tab_type';

let widgetHandle = null;

// 添加tab导航
function addTabNavs(sport, params) {
	const navList = typeList[sport];

	if (!navList) return;

	let str = '';

	// 先看是否有记录
	const lastType = sessionStorage.getItem(APP_SESSION_TYPE) || navList[0].type;
	const targetIndex = navList.findIndex(x => x.type === lastType);

	for (let i = 0; i < navList.length; i++) {
		const item = navList[i];
		if (i === targetIndex) {
			str += `<li class="m-type-item active" data-type="${item.type}">${item.label}</li>`;
		} else {
			str += `<li class="m-type-item" data-type="${item.type}">${item.label}</li>`;
		}
	}

	const parent = document.querySelector('.m-type-list');

	if (parent) {
		parent.innerHTML = str;

		document.body.addClass('has-tabs');

		parent.addEventListener('click', e => {
			const target = e.target;

			// 添加导航切换事件
			if (target.hasClass('m-type-item')) {
				const lastActive = document.querySelector('.m-type-list .m-type-item.active');
				lastActive.removeClass('active');
				target.addClass('active');

				const { type } = target.dataset;
				if (type) {
					configWidget({
						type,
						height: params.height,
						id: params.id
					});

					// 记录当前tab type值
					sessionStorage.setItem(APP_SESSION_TYPE, type);
				}
			}
		});
	}
}

// 配置并添加 widget
function configWidget({ type = 'h2h', height, id }) {
	if (widgetHandle) {
		window.SRLive.removeWidget(widgetHandle);
	}

	const h = +height > 0 ? +height + 'px' : '400px';

	const config = {
		/* shared configuration */
		container: '.africa-livetracker',
		// height写死400px
		height: type === 'h2h' ? 'auto' : h,
		showTitle: false,
		// 12156154
		matchId: id,
	};

	if (type !== 'h2h') {
		// lmts才有的参数
		Object.assign(config, {
			/* avaliable for widgets.lmts only */
			/** 下面的参数仅仅对lmts的管用 */
			// showGoalscorers: true,
			// momentum2_showArea: true,
			showMomentum: true, //  timeline/momentum 是否显示
			// showMomentum2: 'line', // 'bar'
			// sidebarLayout: 'bottom', // 'dynamic', 会根据 width 自动调整
			pitchCrowd: true, // 显示赛场背景人群
			showPitch: true, // 显示赛场
			showSidebar: false, // 显示
			// showHeatmap: true,
			// showLineups: true, // 该属性需要对方配置 that cannot be controled
			collapse_enabled: false, // allow to be collapsed or not
			collapse_startCollapsed: true // collapsed
		});
	}

	widgetHandle = window.SRLive.addWidget({
		/* widgets type */
		// 根据参数取不同的widgets 默认是 lmts
		name: widgetTypes[type] || 'widgets.lmts',
		config,
		callback: () => {
			document.querySelector('#pageLoading').style.display = 'none';
		}
	});
}

// 获取所有url参数
function init () {
	let params = URL.getPara(true);
	params = params || {};
	if (!params.id) {
		return;
	}

	const sport = sportsConfigById[`sr:sport:${params.sport}`];

	if (sport) {
		addTabNavs(sport.name, params);
	}

	// 先看type是否有记录
	const lastType = sessionStorage.getItem(APP_SESSION_TYPE);

	const type = params.h2h ? (lastType || 'h2h') : 'lmts';

	configWidget({
		type,
		height: params.height,
		id: params.id
	});
}

init();
