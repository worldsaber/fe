const getCfg = require('../util');

module.exports = function entries (pcRules, wapRules, opt) {
	wapRules = wapRules || './mobile/**/*.json'; // eslint-disable-line
	pcRules = pcRules || './desktop/**/*.json'; // eslint-disable-line
	opt = Object.assign({}, opt, {// eslint-disable-line
		cwd: __dirname
	});
	return {
		pc: typeof pcRules !== 'string' ? [] : getCfg(pcRules, opt),
		wap: typeof wapRules !== 'string' ? [] : getCfg(wapRules, opt)
	};
};
