// import cookie from 'storage/cookie';

export function getMoneyFraction() {
	const country = window.country;
	if (country === 'gh') {
		return 2;
	}
	return 0;
}
export const conditionMutiple = {
	ke: 1,
	ng: 3,
	gh: 0.05,
};
export function getCountryMultiple() {
	return conditionMutiple[window.country || 'ke'];
}
/**
 * 预加载图片，并在资源都加载完毕后返回状态
 * @param { 图片地址数组 } images
 */
export function preLoadImages(images) {
	const allPromise = images.map(image => loadImg(image));
	return Promise.all(allPromise);
}
/**
 * 加载单个图片，封装返回promise
 * 没有处理加载失败的情况，默认都是加载成功，检查是否加载状态
 * @param {图片地址} imgUrl
 */
export function loadImg(imgUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			resolve(true);
		};
		img.onerror = () => {
			resolve(false);
		};
		img.src = imgUrl;
		if (img.complete) {
			resolve(true);
		}
	});
}

export function getData() {
	return fetch('/promotion/v1/activities/summary/data', {
		method: 'GET',
		// body: { userId: cookie('userId') },
	})
	.then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			return res.data;
		}
		return Promise.reject();
	});
}
// 分享图片地址映射 adj-noun:  key
//  https://s.sporty.net/common/main/res/${key}.png
const shareKeyMap = {
	'dynamic-ceo': 'ad89e8703e203e4784d0ce340f6d28aa',
	'dynamic-president': '7a125c7155f3895a343893bad55549fd',
	'energetic-ceo': '13bd9a85b8f864655bac7a89942c3b21',
	'energetic-president': 'e31a0cf206ccd64e3c50a29231e4d353',
	'experienced-ceo': '7c39e64e0233037a21a466171e6a415d',
	'experienced-president': 'ae66d75eb01fa37a0be15a5e6ec5420b',
	'humble-ceo': 'eb851968e4557c1b3c3dec791701d043',
	'humble-president': 'e7c269dedf8ce953e5dc505d31f397cb',
	'jovial-ceo': '73c75e8da029cec4aea82bff3a14654c',
	'jovial-president': 'f7fe2e032fb51fd3ef4ecabb3908d547',
	'reliable-ceo': 'abdb37c0f37b4e4e500e4876ba884d3c',
	'reliable-president': 'e7038fbf5e0ac0669c8f0d4cf3013077',
	'talented-ceo': '857e60609df356dcf7377abdd17ba4be',
	'talented-president': '850a33b416548639debaf8f647fd86f5',
	'versatile-ceo': 'efc216ca24fd3d8cbf6a25928e5af11f',
	'versatile-president': 'f4403e7a70fc42873f4278c702d52eba',

	'dynamic-boss': 'd20e9a694ca8052cc43d61aea3ad9875',
	'dynamic-trainer': '87a1e090c440a50ae72e213d497c5a01',
	'energetic-boss': '151fc02c790a1cd17a7e26bc47cd9ea4',
	'energetic-trainer': '21b7971506537a6a417834361081f2c3',
	'experienced-boss': 'd6d9994883e6b69a04cbfd3daec2c7c7',
	'experienced-trainer': '4052a50a752fc673d9a844ec930292e1',
	'humble-boss': '36d36c86f78e97aac00239901ea470b0',
	'humble-trainer': '76794b3fed83175b2fbeafe62426e119',
	'jovial-boss': '807e09177e662fdfd39892105339474a',
	'jovial-trainer': '9ec77f0003e5dc044f9ee92a27795e0f',
	'reliable-boss': 'cf607ac8200a82b228c96d3a78bd79f9',
	'reliable-trainer': '47f50587901dabb3ebb2a75422677796',
	'talented-boss': '23dca2b4609f31c83a8ad768100b063b',
	'talented-trainer': '6b2bc4efac9db0039c22206ea4aaecdd',
	'versatile-boss': '3048d6d56f973bc3830b97a41d973509',
	'versatile-trainer': 'b14de7bf538ba65f916b15b8f9ef95',

	'dynamic-captain': '11b3d1f078501d560814d5142b0dbc',
	'energetic-captain': '8a54564e37328e04c4c6cacc1e9eab15',
	'experienced-captain': '6221b95036a41a108163315645844424',
	'humble-captain': '571482444cd588f25942b5149ac511d2',
	'jovial-captain': '87d0f77fa3b3c54304e936527602863',
	'reliable-captain': '1e04c05c7cd555636e4063681dac2522',
	'talented-captain': 'b29b2fdd89eabefb082d0a100fd4de5f',
	'versatile-captain': '6fb3f96d5c92dd2d9aa89b6f722dc597',

	'dynamic-manager': '39701e5053d863045f819a6ff2e11401',
	'energetic-manager': 'd039fcac64bd41cd4205f6861fbd0eeb',
	'experienced-manager': 'b5868c869a6599d2e00292c0a0cae81c',
	'humble-manager': 'ea4f35b859acd3b2ff6d81cafc337db',
	'jovial-manager': 'e60503d238d825d99eb8090287a04355',
	'reliable-manager': '6a86b160882bacf16b0c9c1a7052075a',
	'talented-manager': 'a6c1a1a499205294837c6e21c160f32a',
	'versatile-manager': '297d4e478af9e8e9670c2ac1cf7bc527',
};

export function getShareKey(adj, noun) {
	const ads = adj.split(' ');
	const key = `${ads[1].toLowerCase()}-${noun.toLowerCase()}`;

	return shareKeyMap[key];
}
