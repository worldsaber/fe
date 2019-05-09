import Vue from 'vue';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

Vue.use(Viewer);

/* 参数配置请看 readme */
Viewer.setDefaults({
	toolbar: false,
	navbar: false,
	title: false,
	minZoomRatio: 0.5,
	maxZoomRatio: 10
});

export default Viewer;
