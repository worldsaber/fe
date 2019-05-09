// toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
		value (callback, type, quality) {
			let binStr = atob(this.toDataURL(type, quality).split(',')[1]),
				len = binStr.length,
				arr = new Uint8Array(len);

			for (let i = 0; i < len; i++) {
				arr[i] = binStr.charCodeAt(i);
			}

			callback(new Blob([arr], { type: type || 'image/png' }));
		}
	});
}

/**
 * 添加字体样式
 * @param {Object} ctx 		[canvas context]
 * @param {Object} font 	[font style object]
 */
function setFontStyle (ctx, font) {
	if (!font) return;
	/* eslint-disable */
	let fontStyle = ''
	if (font.weight) {
		fontStyle += font.weight
	}
	if (font.size) {
		fontStyle += ` ${font.size}/${font.lineHeight}`
	}
	if (font.family) {
		fontStyle += ` ${font.family}`
	}
	/* eslint-enable */
	ctx.font = fontStyle;
}

/**
 * 添加 text-shadow 样式
 * @param {Object} ctx 			[canvas context]
 * @param {Object} textShadow 	[text shadow style object]
 */
function setTextShadowStyle (ctx, textShadow) {
	if (!textShadow) return;
	ctx.shadowColor = textShadow.color;
	ctx.shadowOffsetX = textShadow.offsetX || 0;
	ctx.shadowOffsetY = textShadow.offsetY || 0;
	ctx.shadowBlur = textShadow.blur || 0;
}

/**
 * 图片生成器
 */
export default class ImageMaker {
	/**
	 *
	 * @param {Number} width 		[画布宽]
	 * @param {Number} height 		[画布高]
	 * @param {String} selector  	[cavans css 选择器]
	 * @param {Object} data  		[待绘制的数据对象, 包含图片、文案等]
	 */
	constructor ({ width, height, selector, data = {}}) {
		this.data = data;
		this.init({ width, height, selector });
	}
	// 初始化
	init ({ width, height, selector }) {
		if (selector) {
			this.canvas = document.querySelector(selector);
		} else {
			this.canvas = document.createElement('canvas');
			this.canvas.style.display = 'none';
		}
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = width;
		this.canvas.height = height;
	}
	// 清空画布
	clear () {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	/**
	 * 获取 绘制完的 blob 数据
	 * @param {String} type 图片格式, 默认 image/png， 可选 image/jpeg 或者 image/webp
	 * @param {Number} encoderOptions 值在0与1之间，当请求图片格式为image/jpeg 或者 image/webp时用来指定图片展示质量。如果这个参数的值不在指定类型与范围之内，则使用默认值，其余参数将被忽略。
	 */
	toBlob (type = 'image/png', encoderOptions = 1) {
		const canvas = this.canvas;
		return new Promise(resolve => {
			canvas.toBlob(blob => {
				resolve(blob);
			}, type, encoderOptions);
		});
	}
	// 绘制文本
	renderText(content) {
		if (!content) return;
		this.ctx.save();
		// 添加样式
		const { color, font, textShadow, maxWidth, textAlign } = content;
		if (color) {
			this.ctx.fillStyle = color;
		}
		this.ctx.textBaseline = 'middle';
		setFontStyle(this.ctx, font);
		setTextShadowStyle(this.ctx, textShadow);

		if (textAlign) {
			this.ctx.textAlign = textAlign;
		}

		if (maxWidth) {
			this.ctx.fillText(content.text, content.x, content.y, maxWidth);
		} else {
			this.ctx.fillText(content.text, content.x, content.y);
		}
		this.ctx.restore();
	}

	/**
	 * 绘图
	 * @param {String} src 		图片路径
	 * @param {Number} width 	绘制图像的宽度
	 * @param {Number} height 	绘制图像的高度
	 * @param {Number} dx 		横坐标
	 * @param {Number} dy 		纵坐标
	 */
	async renderImage({ src, dWidth, dHeight, dx = 0, dy = 0 }) {
		if (!src) return;

		return new Promise(resolve => {
			const image = new Image();
			image.crossOrigin = 'Anonymous';
			image.src = src;
			image.onload = () => {
				this.ctx.save();
				if (dWidth && dHeight) {
					this.ctx.drawImage(image, dx, dy, dWidth, dHeight);
				} else {
					this.ctx.drawImage(image, dx, dy);
				}
				this.ctx.restore();
				return resolve();
			};
		});
	}
	// 综合绘制
	async render() {
		if (!this.data) return;

		if (this.data.imageList) {
			for (const img of this.data.imageList) {
				await this.renderImage(img); // eslint-disable-line
			}
		}

		if (this.data.textList) {
			this.data.textList.forEach(content => {
				this.renderText(content);
			});
		}
	}
}
