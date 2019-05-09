import { setGlobalHeaders } from 'fetch';
import { parseChannel } from 'utils/channel';

const params = {
	platform: 'wap',
	ClientId: 'wap'
};

const from = parseChannel();

/* 在request header 中添加渠道码 */
if (from) {
	params.Channel = from;
}

setGlobalHeaders(params);
