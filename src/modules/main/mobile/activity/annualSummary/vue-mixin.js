import ImagesMap from './images/config';
import { getNextRoute } from './router/config';
import { preLoadImages } from './util';

export default {
	methods: {
		getPendingImages() {
			const routeName = getNextRoute.call(this);
			const map = ImagesMap[routeName];
			if (map) {
				if (typeof map === 'function') {
					return map();
				}
				return map;
			}
			return {};
		}
	},
	mounted() {
		this.$nextTick(() => {
			const images = this.getPendingImages();
			const list = Object.values(images);

			const prom = preLoadImages(list);
			prom.then(() => {
				this.imageLoading = true;
			});
		});
	}
};

