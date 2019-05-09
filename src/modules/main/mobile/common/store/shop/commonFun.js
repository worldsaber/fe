export function clearData(item = {}) {
	item.isSoldout = !item.remainNum;

	let tempPrice = item.sharePrice && item.sharePrice / 10000 || 0;
	tempPrice = tempPrice.toFixed(2);
	tempPrice = +tempPrice;
	item.showPrice = tempPrice;

	tempPrice = item.giftAmount && item.giftAmount / 10000 || 0;
	tempPrice = tempPrice.toFixed(2);
	tempPrice = +tempPrice;
	item.showAmount = tempPrice;

	return item;
}

export default clearData;
