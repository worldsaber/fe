import '../../mockData/myAccount/index?debug';

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

export const itemsMap = [{
	label: 'Nickname',
	key: 'nickname',
}, {
	label: 'First Name',
	key: 'firstName'
}, {
	label: 'Last Name',
	key: 'lastName'
}, {
	label: 'Date of Birth',
	key: 'birthday',
	showValue: 'birthdayStr'
}, {
	label: 'Gender',
	key: 'gender',
	showValue: 'genderStr'
}, {
	label: 'Location',
	key: 'state',
}, {
	label: 'Email',
	key: 'email'
}, {
	label: 'Change Password',
	key: 'password'
}];

// 获取月份天数 m为月份数字，从1开始
export function getMonthDayData (m) {
	const year = new Date().getFullYear();
	const month = Number(m || 1);
	const day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const dayArr = [];
	if (isLeapYear(year)) {
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

// 密码是否合法
export function isValidPsw (psw, isOldPsw = false) {
	let err = '';
	if (!psw) {
		err = (isOldPsw ? 'Old ' : '') + 'Password is required.';
	} else if (psw.length < 6) {
		err = 'Password cannot be shorter than 6 characters.';
	} else if (psw.length > 14) {
		err = 'Password cannot be longer than 14 characters.';
	} else if (!/\d/.test(psw) || !/[a-zA-Z]/.test(psw)) {
		err = 'Password must contain at least one letter and one number.';
	} else if ('01234567890'.indexOf(psw) !== -1) {
		err = 'Password cannot contain multiple consecutive numbers .';
	}
	// 旧密码提示就两种，空和错误
	if (err && isOldPsw && psw) {
		err = 'The password is incorrect. Please try again.';
	}
	return err;
}

// 修改保存个人信息项
export function saveAccountItem (data) {
	const param = {};
	if (data.state) param.state = data.state; // 接口字段变动。涉及到location的更新时param.value变更为param.state和param.area
	if (data.area) param.area = data.area;
	if (!param.state && !param.area) param.value = data.value || '';
	return new Promise((resolve, reject) => {
		fetch('/patron/account/info/' + data.key, {
			method: 'PUT',
			body: param
		})
		.then(res => res.json())
		.then(data => {
			resolve(data.bizCode);
		}).catch(() => {
			reject(false);
		});
	});
}
