import emojiCode from './emojiCode.js';

// 当前用到的emoji类
const currentEmojiTypes = ['people', 'nature', 'objects'];

class Emoji {
	get list() {
		const result = currentEmojiTypes.reduce((sub, cur) => {
			if (emojiCode[cur]) {
				return sub.concat(emojiCode[cur]);
			}
			return [];
		}, []);
		return result.map(this.getEmoji);
	}
	getEmoji(code) {
		return String.fromCodePoint(code);
	}
}

export default new Emoji();
