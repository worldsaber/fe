export const monthData = [
	{ name: 'Jan', value: '01' },
	{ name: 'Feb', value: '02' },
	{ name: 'Mar', value: '03' },
	{	name: 'Apr', value: '04' },
	{	name: 'May', value: '05' },
	{	name: 'June', value: '06' },
	{	name: 'July', value: '07' },
	{	name: 'Aug', value: '08' },
	{	name: 'Sept', value: '09' },
	{	name: 'Oct', value: '10' },
	{	name: 'Nov', value: '11' },
	{	name: 'Dec', value: '12' }
];

// 获取月份天数 m为月份数字，从1开始
export function getMonthDayData (m, year) {
	// const year = new Date().getFullYear();

	const month = Number(m || 1);
	const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const dayArr = [];
	if (year && isLeapYear(year)) {
		day[1] = 29;
	}
	for (let i = 1; i <= day[month - 1]; i++) {
		dayArr.push(i < 10 ? '0' + i : String(i));
	}
	return dayArr;
}

// 是否是闰年
export function isLeapYear (year) {
	return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}

export function getYearData () {
	const year = new Date().getFullYear();
	const yearArr = [];
	for (let i = year - 18; i >= year - 100; i--) {
		yearArr.push(String(i));
	}
	return yearArr;
}

export function getBirthYearData () {
	const year = new Date().getFullYear();
	const yearArr = [];
	for (let i = year - 1; i >= year - 100; i--) {
		yearArr.push(String(i));
	}
	return yearArr;
}
