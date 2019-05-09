import Push from './index';
import './betPush';

const userPush = window.push || new Push();

if (!window.push) {
	window.push = userPush;
}

export default userPush;
