import { shareAmount } from './config';

function getTerm() {
	return [
		'During the promotion period, SportyBet will appoint specific matches for customers to predict their score for the matches\' regular time(includes injury stop time, and excludes overtime and penalty shootout).',
		'Customers must predict scores and share their prediction as "Public" before the deadline for the current prediction to take part in the Sporty Predict & Win promotion. (A customer can share as many times as wanted, but only the first time a customer\'s clicks to share the prediction will be registered as the customer\'s official prediction for the match.)',
		`After each match, all customers who correctly predicted the score and successfully shared their prediction as "Public" will share ${shareAmount()} Cash Gifts.`,
		'All winners will get an SMS notification from SportyBet informing them on their winnings. Non-registered customers must register within 48 hours to make sure they are able to receive the reward. The Cash Gifts will be distributed within 48 hours after customer receiving the winnings SMS.',
		'In this promotion, SportyBet only allows one chances to award the offer per person / household address / email address / mobile number / debit / credit card number / IP address / device number. Duplicate accounts will be closed and will not qualify for this offer. Any winnings obtained unlawfully from this bonus will be removed. Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts. SportyBet reserves itself the rights to amend, cancel, reclaim or refuse any promotion at its own discretion.'
	];
}
export default getTerm;
