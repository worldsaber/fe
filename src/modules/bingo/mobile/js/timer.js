class Timer {
	constructor() {
		this.timerId = '';
		this.list = [];
		this.handles = [];
	}
	start() {
		if (!this.timerId) {
			this.timerId = setInterval(() => {
				const now = (new Date()).getTime();

				this.handles.forEach(handle => {
					handle(now);
				});
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].ts <= now) {
						this.list[i].cb();
						this.list.splice(i, 1);
						i--;
					} else {
						break;
					}
				}
			}, 100);
		}
	}
	add(cb, ts) {
		this.checkRun();
		if (this.list.length === 0) {
			this.list.push({
				ts,
				cb
			});
		} else if (this.list[this.list.length - 1].ts < ts) {
			this.list.push({
				ts,
				cb
			});
		} else {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].ts > ts) {
					this.list.splice(i, 0, {
						ts,
						cb
					});
					break;
				}
			}
		}
	}
	remove(cb) {
		this.list.forEach((obj, i) => {
			if (obj.cb === cb) {
				this.list.splice(i, 1);
			}
		});
		this.checkStop();
	}
	addHandler(cb) {
		this.checkRun();
		this.handles.push(cb);
	}
	removeHandler(cb) {
		const index = this.handles.indexOf(cb);
		index > -1 && this.handles.splice(index, 1);
		this.checkStop();
	}
	checkRun() {
		if (!this.isRunning()) {
			this.start();
		}
	}
	// 检查是否在空转
	checkStop() {
		if (this.list.length === 0 && this.handles.length === 0) {
			this.stop();
		}
	}
	// 停止计时
	stop() {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
	}
	// 计时器是否在运行中
	isRunning() {
		return !!this.timerId;
	}
}

export default new Timer();
