export function getCompatiblePathKey (key) { // eslint-disable-line
	switch (key) {
	case 'how-to-play/others/withdraw':
		return 'how-to-play/others/how-to-withdraw';
	case 'how-to-play/others/transactions-history':
		return 'how-to-play/others/how-to-view-transactions-and-bet-history';
	case 'how-to-play/others/bonuses':
		return 'how-to-play/others/bonuses-and-gifts';
	case 'how-to-play/others/deposit':
		return 'how-to-play/others/how-to-deposit';
	default:
		return key;
	}
}

