import { betType2Key } from 'config/couponsConfig';

export function checkCoupons(oldCoupons = [], couponsList = [], checkedGift) {
	const hasChecked = oldCoupons.includes(checkedGift);

	if (hasChecked) {
		const couponItem = couponsList.find(x => x.giftId === checkedGift) || {};
		return couponItem.status === 30;
	}

	return false;
}

export function getCheckedId(coupons) {
	const betTypeName = betType2Key[coupons.betType],
		giftId = coupons.checkGifts[betTypeName] || '';

	return giftId;
}
