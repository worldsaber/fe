import liveFavor from './live-favor.png';
import prematchFavor from './prematch-favor.png';
import favored from './favored.svg';
import unfavor from './unfavor.svg';

export function getFavorUrl(isFavor) {
	return isFavor ? favored : unfavor;
}

export default {
	live: liveFavor,
	prematch: prematchFavor
};
