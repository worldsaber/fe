/* eslint-disable */
// includes polyfill
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
/* eslint-enable */

export function addEvent (selector, callback) {
	const targets = document.querySelectorAll(selector);
	const len = targets.length;
	for (let i = 0; i < len; i++) {
		targets[i].addEventListener('click', function (e) { // eslint-disable-line
			callback(e);
		});
	}
}

export function removeActive (target, callback) {
	target.className = target.className.replace(/\s*active/g, '');
	callback && callback();
}

export function addActive (target, callback) {
	target.className += ' active';
	callback && callback();
}

export function recordUrl (url) {
	const state = {
		time: Date.now()
	};

	history.pushState(state, null, url);
}

export function formatLinkSearch (route) {
	route = route || location.search;
	const search = route.replace('?', '');
	let nav,
		subNav;

	if (search) {
		const params = search.split('&');
		nav = params[0] && params[0].split('=')[1];
		subNav = params[1] && params[1].split('=')[1];
	}
	return {
		nav,
		subNav
	};
}
