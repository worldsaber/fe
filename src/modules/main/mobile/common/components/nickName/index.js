import store from 'store/me';
import dialog from 'components/dialog';
import { LS } from 'storage';
import content from './setName.vue';

export function checkNickname() {
	const nicknamePopedTime = +LS.get('wap_nickname_poped');

	const nickname = store.state.me.nickname;
	if (nickname && nickname.length > 0) {
		return true;
	}

	// 24小时内不弹窗
	if (Date.now() - nicknamePopedTime < 86400000) {
		return true;
	}

	// 距上次点击later 24小时后，用户若再次点击later，就再也不弹窗了
	const count = LS.get('wap_nickname_poped_count');
	if (count > 1) {
		return true;
	}

	const d = dialog({
		title: 'Set Nickname',
		content,
		button: []
	});
	d.onMounted(() => {
		setTimeout(() => {
			const inputEl = d.$content.$refs.input.$refs.input;
			inputEl && inputEl.focus();
		}, 0); // microTask 不好使
	});
}

export default {
	checkNickname
};
