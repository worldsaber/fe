import Vue from 'vue';
import Steps from './src/steps';
import Step from './src/step';

import './step.less';
import './steps.less';

let stepsInstalled = false,
	stepInstalled = false;

Steps.install = function(Vue) {
	if (stepsInstalled) {
		return;
	}
	Vue.component(Steps.name, Steps);
	stepsInstalled = true;
};

Step.install = function(Vue) {
	if (stepInstalled) {
		return;
	}
	Vue.component(Step.name, Step);
	stepInstalled = true;
};

Vue.use(Steps);
Vue.use(Step);
export default {
	Steps,
	Step
};
