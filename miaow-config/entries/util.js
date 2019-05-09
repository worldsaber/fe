const glob = require('glob');
const path = require('path');

module.exports = function getCfg (rule, opt) {
	opt = opt || {}; // eslint-disable-line
	const cwd = opt.cwd || __dirname;
	const isRepeat = {};
	// 读取所有desktop和mobile下地json配置文件
	const files = glob.sync(rule, opt);
	return files.reduce((res, cur) => {
		const json = require(path.resolve(cwd, cur)); // eslint-disable-line
		if (Array.isArray(json)) {
			json.forEach(cur => {
				if (cur && (cur.script || cur.template)) {
					if ((cur.script && isRepeat[cur.script]) || (cur.template && isRepeat[cur.template])) {
						throw new Error(`${cur.script}或${cur.template}配置已经存在于其他模板文件`);
					}
					isRepeat[cur.script] = true;
					isRepeat[cur.template] = true;
					res.push(cur);
				}
			});
		}
		return res;
	}, []);
};
