#timer定时器
	用来做倒计时逻辑，引入Timer实例
	Timer.start(); 开始执行计时器逻辑；
	Timer.add(callback, ts); 添加一个计时处理，ts（毫秒）后执行callback；
	Timer.remove(callback); 移除一个定时处理，注意callback应该和add中callback是同一引用；
	Timer.addHandler(callback); 添加一个轮询处理，内部定时器每次时间检查都会触发callback，并传一个当前定时器时间戳，比如需要获取倒计时时间的场景会用到。
	Timer.removeHandler(callback); 移除对应轮询处理.
