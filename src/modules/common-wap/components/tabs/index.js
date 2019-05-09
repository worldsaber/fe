import { AfTabs, AfTabPane } from 'packages/tabs';
import translateScroll from 'components/translateScrollX';
import setCenter from './setCenter';

AfTabs.mixins = [translateScroll('nav', '.m-tabs-tab'), setCenter];

export {
	AfTabs,
	AfTabPane
};

export default {
	AfTabs,
	AfTabPane
};
