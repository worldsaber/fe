export const keyToType = {
	0: 'unsettled',
	1: 'settled',
	10: 'all'
};
export const typeToKey = {
	unsettled: 0,
	settled: 1,
	all: 10
};
export const orderTypeMap = {
	1: 'Singles',
	2: 'Multiple',
	3: 'System',
	4: 'Multiple'
};
export const statusMap = { // winningStatus
	0: 'Running',
	5: 'Partial Win',
	20: 'Won',
	40: 'Void',
	30: 'Lost',
	90: 'Pending'
};
export const colorMap = {
	0: '', // running
	5: '', // partial win
	20: 'green', // win
	30: 'gray', // lost
	90: '' // pending
};
export const favorType = {
	1: 'Cash Gift',
	2: 'Discount Gift'
};
// betDetail中用 selection
export const status = {
	0: 'Running',
	1: 'Won',
	2: 'Lost',
	3: 'Void',
	4: 'Void' // 'refund all' 显示成 Void
};
export const comboType = {
	1: 'Single',
	2: 'Doubles',
	3: 'Triples'
};
// betDetail中用 bet的状态
export const betStatusMap = {
	0: 'Running',
	1: 'Won',
	2: 'Lost',
	3: 'Void',
	4: 'Won',
	90: 'Pending' // combination 后台返void的话显示won
};
// betDetail中用 combo组合
export const comboStatusMap = {
	0: 'Running',
	1: 'Won',
	2: 'Lost',
	3: 'Void',
	4: 'Won' // combination 后台返void的话显示won
};
export const jackpotPickMap = {
	1: '1',
	2: 'X',
	3: '2',
};
export const jackpotSelStatus = { // status map for selection in jackpot
	0: 'Lost',
	1: 'Won',
	2: 'Void'
};
