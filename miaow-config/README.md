## 项目模块说明
1. 项目下 modules目录下的代码所有模块，每个模块可以认为是一个完成的项目
2. 模块下可以有自己的common，在common中有自己的组件和公共
3. 模块下应该分mobile和desktop 2个目录分别标记 桌面版本和移动版本，即使没有其中一个版本也应该有2个目录
4. 模块与模块之间可以有公共内容，请放在 modules下的common目录下，分desktop和mobile放

## 项目编译说明
1. 项目编译全部在miaow-config中
2. entries下每个目录代表每个模块的入口文件，可以在json文件中添加新的入口文件,入口文件路径均相对于src目录
3. 模块下的country代表每个国家的编译代码
	- 每个国家的编译代码下面会有每个模块的编译配置
	- 添加新的国家需要建立国家的目录，然后在国家的目录添加对应的模块,sw模块是serviceWorder模块是必须的模块
4. 项目可以通过npm run start编译，可以带国家参数，或者模块参数  如  `npm run start -- -c=ke -m=bingo`，即编译ke国家下的bingo模块
