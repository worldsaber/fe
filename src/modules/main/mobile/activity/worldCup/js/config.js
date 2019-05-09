import { isDuringSpecialPeriod } from './util.js';

const shareAmounts = isDuringSpecialPeriod ? {
	ke: 'KES 50,000',
	ng: 'NGN 100,000',
	gh: 'GHS 1,000'
} : {
	ke: 'KES 100,000',
	ng: 'NGN 200,000',
	gh: 'GHS 2,000'
};

export function shareAmount() {
	return shareAmounts[window.country];
}
export function shareTitle() {
	const amount = shareAmounts[window.country];
	return `Share as "Public" to participate in this promotion! Customers who correctly predicted the score and successfully shared their prediction as "Public" will share ${amount}!`;
}
export function routeTitle() {
	const amount = shareAmounts[window.country];
	return `Participate and share ${amount}!`;
}
