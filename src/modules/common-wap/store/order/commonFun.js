import dateFormat from 'kernel/js/dateFormat';

export function formatDate(date, regular) {
	return date && dateFormat.format(date, regular || 'DD/MM/YYYY') || '';
}

export function formatDateYear2(date, regular) {
	return date && dateFormat.format(date, regular || 'DD/MM/YY') || '';
}

export function formatWithoutYear(date, regular) {
	return date && dateFormat.format(date, regular || 'DD/MM HH:mm') || '';
}

export function foramtTime(date, regular) {
	return date && dateFormat.format(date, regular || 'HH:mm:ss') || '';
}

export function getBetStatusDesc(status) {
	const statusDescMap = {
		1: 'Won',
		2: 'Lost'
	};
	return statusDescMap[status] || '';
}
export function getSelectionStatusDesc(status) {
	const statusDescMap = {
		0: 'Running',
		1: 'Won',
		2: 'Lost',
		3: 'Void',
		4: 'Refund All'
	};
	return statusDescMap[status] || '';
}
export function getCombinationStatusDesc(status) {
	const statusDescMap = {
		0: 'Running',
		1: 'Won',
		2: 'Lost',
		3: 'Void',
		4: 'Cashout'
	};
	return statusDescMap[status] || '';
}
