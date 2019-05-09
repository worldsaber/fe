<template lang="html">
    <AfTabs>
        <AfTabPane label="标签一">标签一的内容</AfTabPane>
        <AfTabPane label="标签二" disabled>标签二的内容</AfTabPane>
        <AfTabPane label="标签三">标签三的内容</AfTabPane>
    </AfTabs>
</template>
<script>
// import Tabs from './tabs.vue';
// import TabPane from './pane.vue';

import { AfTabs, AfTabPane } from './index';

export default {
	// components: {
	// 	Tabs,
	// 	TabPane
	// }
};
</script>
