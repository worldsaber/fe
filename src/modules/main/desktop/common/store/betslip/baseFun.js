import { isEmptyObject } from 'utils';

export function updateList(key, list = [], action = 'add') {
	if (!Array.isArray(list) || !key) {
		return;
	}

	const checkIndex = list.indexOf(key);
	if (action === 'add') {
		(checkIndex === -1) && list.push(key);
	}

	if (action === 'delete') {
		(checkIndex !== -1) && list.splice(checkIndex, 1);
	}
}

export function updateStatusList(opt = {}) {
	if (isEmptyObject(opt) || !opt.key) {
		return;
	}

	const { key, statusInfo, changesKeys, suspendedKeys, unavailableKeys } = opt,
		statusDesc = statusInfo.statusDesc || '';

	// suspended和unavailable多次相同效果，不做重复处理
	if ((statusDesc === 'suspended' && suspendedKeys.includes(key)) ||
		(statusDesc === 'unavailable' && unavailableKeys.includes(key))
	) {
		return false;
	}

	if (changesKeys.includes(key)) {
		changesKeys.splice(changesKeys.indexOf(key), 1);
	}

	if (suspendedKeys.includes(key)) {
		suspendedKeys.splice(suspendedKeys.indexOf(key), 1);
	}

	if (unavailableKeys.includes(key)) {
		unavailableKeys.splice(unavailableKeys.indexOf(key), 1);
	}

	(statusDesc === 'suspended') && suspendedKeys.push(key);
	(statusDesc === 'unavailable') && unavailableKeys.push(key);
	(['up', 'down'].includes(statusDesc)) && changesKeys.push(key);

	return true;
}

export function checkBetItem(betslipsKeys = [], betslips = [], item = {}) {
	const index = betslipsKeys.indexOf(item.key);

	if (index === -1) {
		return {
			type: 'add'
		};
	}

	const betItem = betslips[index];

	// 1 < 3
	if (betItem.marketInfo.product < item.product) {
		return {
			type: 'jmp',
			index
		};
	}

	return {
		type: 'replace',
		index
	};
}
