import 'core/core';
import 'base/base';
import { formatLinkSearch, addEvent, recordUrl, addActive, removeActive } from './utils';

window.onload = function () {
	const panelTitles = document.querySelectorAll('.help-content-wrap > h3');
	panelTitles.forEach(item => {
		item.innerHTML = '<i class="m-icon--arrow"></i>' + item.innerHTML;
	});

	addMenuItemAnimatation();
	navTo();

	const navObj = formatLinkSearch();
	switchMainInfo(navObj);
	switchMenuNav(navObj);

	const menuList = document.querySelector('.m-menu-group .m-menu-list.active');
	menuList.style.height = 44 * menuList.children.length + 'px';
};

function navTo () {
	const menuItemList = document.querySelectorAll('.m-menu-item');

	addEvent('.m-menu-item', e => {
		const target = e.target;
		const navData = target.getAttribute('data-to');

		if (target.className.includes('active')) {
			return;
		}
		addActive(target);

		if (menuItemList.length) {
			for (let i = 0; i < menuItemList.length; i++) {
				if (menuItemList[i] !== target) {
					removeActive(menuItemList[i]);
				}
			}
		}

    /* 记录路由 */
		const url = location.href.split('?')[0].concat(`?${navData}`);
		if ('pushState' in history) {
			recordUrl(url);

      /* 修改main-info显示内容 */
			const navObj = formatLinkSearch(navData);
			switchMainInfo(navObj);
		} else {
			location.href = url;
		}
	});
}

function switchMenuNav (navInfo) {
	navInfo = navInfo || {};
	const menuItemList = document.querySelectorAll('.m-menu-item');
	if (menuItemList.length) {
		let navData;
		for (let i = 0; i < menuItemList.length; i++) {
			navData = menuItemList[i].getAttribute('data-to');
			if (navData.includes(navInfo.nav) && !menuItemList[i].className.includes('active')) {
				addActive(menuItemList[i]);
				addActive(menuItemList[i].parentNode);
				addActive(menuItemList[i].parentNode.previousElementSibling);
			} else {
				removeActive(menuItemList[i]);
			}
		}
	}
}

function switchMainInfo (navInfo) {
	navInfo = navInfo || { nav: 'faq' };
	if (!navInfo.nav) {
		navInfo.nav = 'faq';
	}
	const contents = document.querySelectorAll('.m-main-info .m-content');

	// 切换help一级导航
	let matchItems = [];
	for (let k = 0; k < contents.length; k++) {
		matchItems = contents[k].querySelectorAll('.help-content-wrap');

		if (contents[k].className.includes(navInfo.nav)) {
			if (!contents[k].className.includes('active')) {
				addActive(contents[k]);
				if (matchItems.length) {
					addActive(matchItems[0]);
				}
			}
		} else {
			removeActive(contents[k]);
			if (matchItems.length) {
				for (let m = 0; m < matchItems.length; m++) {
					removeActive(matchItems[m]);
				}
			}
		}
	}

	// 切换help二级导航
	if (navInfo.subNav) {
		const currentMatchItems = document.querySelectorAll('.m-content.active .help-content-wrap');
		for (let m = 0; m < currentMatchItems.length; m++) {
			const matchedItem = currentMatchItems[m];
			const matchId = matchedItem.querySelector('h3').id;
			if (matchId) {
				if (matchId === navInfo.subNav) {
					if (!matchedItem.className.includes('active')) {
						addActive(matchedItem);
					}
				} else {
					removeActive(matchedItem);
				}
			}
		}
	}
}

function addMenuItemAnimatation () {
	addEvent('.m-menu-group-title', e => {
		let target = e.target;

		if (target.className.includes('m-icon-arrow2')) {
			target = target.parentNode;
		}

		if (target.className.includes('active')) {
			removeActive(target, () => {
				const sibling = target.nextElementSibling;
				if (sibling) {
					sibling.className = sibling.className.replace(' active', '');
					sibling.style.height = 0;
				}
			});
		} else {
			addActive(target, () => {
				const sibling = target.nextElementSibling;
				const children = sibling.children;
				if (sibling) {
					sibling.className += ' active';
					sibling.style.height = children[0].offsetHeight * children.length + 'px';
				}
			});
		}
	});

	/* 控制主内容区域切换 */
	addEvent('.help-content-wrap > h3', e => {
		let target = e.target.parentNode;

		if (e.target.className.includes('m-icon--arrow')) {
			target = target.parentNode;
		}

		if (target.className.includes('active')) {
			removeActive(target);
		} else {
			addActive(target);
		}
	});
}
