export const flexiTips = 'Increase your chances with our new feature!';

export const flexiDesc = 'Ticket is won if a certain amount of selections or more are correct in all selections. For example, if player chooses 5 or more to be correct of 7. This means player win the ticket if 5 or above selections are correct in total 7 selections.';

export const lockChgTips = 'This feature is invalid when there are 2 or less valid selections';

export const flexiNote = 'Note: Cashout is unavailable with Flexible Bet.';

export function createOrderTips(oddsThreshold) {
	return `The FlexiBet feature can not be applied when the Total Odds is lower than ${oddsThreshold}.`;
}

export const errorTips = {
	noSimple: 'This feature is unavailable when there are contingent outcomes.',
	disabled: 'This feature is constrained with certain number of selections.'
};

export function getFlexiMsg(N, n) {
	if (n === N - 1) {
		return 'If up to <span class="m-t-light">1</span> game cuts ticket, we still pay you!';
	}

	return `If up to <span class="m-t-light">${N - n}</span> games cut ticket, we still pay you!`;
}
