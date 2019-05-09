import { betType2Key } from 'config/couponsConfig';

export function checkCoupons(oldCoupons = [], couponsList = [], checkedGift) {
	const index = oldCoupons.indexOf(checkedGift),
		couponItem = (index !== -1) && couponsList.length && couponsList[index] || {};

	if (couponItem.status === 30) {
		return true;
	}

	return false;
}

export function getCheckedId(coupons) {
	const betTypeName = betType2Key[coupons.betType],
		giftId = coupons.checkGifts[betTypeName] || '';

	return giftId;
}

export function getGiftTips(deviceChScope) {
	let isSupportApp = 0,
		isSupportWap = 0,
		marker = 0,
		maskTips;

	if (deviceChScope.includes(1)) {
		isSupportApp = 1;
	}
	if (deviceChScope.includes(3)) {
		isSupportWap = 2;
	}

	if (deviceChScope.includes(2)) {
		isSupportApp = 0;
		isSupportWap = 0;
	}

	marker = isSupportApp + isSupportWap;
	switch (marker) {
	case 1:
		maskTips = 'Exclusive to the App';
		break;
	case 2:
		maskTips = 'Exclusive to the Mobile Web';
		break;
	case 3:
		maskTips = 'Exclusive to the App / Mobile Web';
		break;
	default:
		maskTips = '';
	}

	return maskTips;
}
