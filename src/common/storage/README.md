# 说明

## cooke ##
    cookie(key); 			//读取cookie
	cookie(key, null, [, option]); 	//删除cookie
	cookie(key, value [,option]);  //写入cookie

## localStorage ##
	LS.get(key);			//获取本地存储值
	LS.set(key, value);	//设置本地存储值
	LS.remove(key);		//删除本地存储值
	LS.clear();			//清空本地存储
	LS.obj();		//返回本地存储副本对象
	LS.each(fn);	//遍历本地存储，fn接受参数 key 和 value
	LS.length;	//本地存储数量
	