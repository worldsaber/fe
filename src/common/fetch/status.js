// 网络错误
export const NETWORK_ERR = {
	err: 1,
	statusText: 'network error',
	message: 'No internet connection, try again.'
};

export const RES_NULL_ERR = {
	err: 1,
	statusText: 'response is null',
	message: 'Sorry, something went wrong. Please try again later.'
};

// 跨域错误
export const CROSS_ORIGIN_ERR = {
	err: 2,
	statusText: 'protocols or ports not match',
	message: 'Sorry, something went wrong. Please try again later.'
};

// 后到优先策略中之前的请求被中断
export const PRE_ABORT_ERR = {
	err: 4,
	statusText: 'abort the previous request',
	message: 'Sorry, something went wrong. Please try again later.'
};

// 先到优先策略中后到的请求被中断
export const NEXT_ABORT_ERR = {
	err: 4,
	statusText: 'abort the next request',
	message: 'Sorry, something went wrong. Please try again later.'
};
