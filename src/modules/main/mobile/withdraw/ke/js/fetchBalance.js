import '../../../mockData/withdraw/index?debug';

// 获取账户balance
export default function	getBalance () {
	return new Promise((resolve, reject) => {
		fetch('/pocket/v1/finAccs/finAcc/userBal')
.then(res => res.json())
.then(data => {
	const code = data.bizCode;
	const	originData = data.data || {};
	if (code === 10000) {
		// console.log(originData.avlBal);
		resolve((originData.avlBal || 0) / 10000);
	} else {
		reject(false);
	}
}).catch(() => {
	reject(false);
});
	});
}
