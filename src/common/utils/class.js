// check if classList interface is available (@see https://developer.mozilla.org/en-US/docs/Web/API/element.classList)
const cl = false && ('classList' in document.createElement('a'));
	// actual Element prototype manipulation
const p = Element.prototype;

const pl = NodeList.prototype;

(function () {
	if (cl) {
		if (!p.hasClass) {
			p.hasClass = function(c) {
				if (!c || !c.trim) {
					return;
				}
				const arr = c.split(' ');
				return arr.some(cur => this.classList.contains(cur));
			};
		}
		if (!p.addClass) {
			p.addClass = function(c) {
				if (!c || !c.trim) {
					return;
				}
				const arr = c.split(' ');
				arr.forEach(cur => cur && !this.hasClass(cur) && this.classList.add(cur));
				return this;
			};
		}
		if (!p.removeClass) {
			p.removeClass = function(c) {
				if (!c || !c.trim) {
					return;
				}
				const arr = c.split(' ');
				arr.forEach(cur => this.hasClass(cur) && this.classList.remove(cur));
				return this;
			};
		}
		if (!p.toggleClass) {
			p.toggleClass = function(c) {
				if (!c || !c.trim) {
					return;
				}
				const arr = c.split(' ');
				arr.forEach(cur => this.classList.add(cur));
				return this;
			};
		}
	} else {
		if (!p.hasClass) {
			p.hasClass = function(c) {
				const e = this.className.split(' ');
				const arr = c.split(' ');
				return arr.some(cur => e.indexOf(cur) > -1);
			};
		}
		if (!p.addClass) {
			p.addClass = function(c) {
				const arr = c.split(' ');
				const ele = this;
				arr.forEach(cur => {
					if (!ele.hasClass(cur)) {
						ele.className = ele.className !== '' ? (ele.className + ' ' + cur) : cur;
					}
				});
				return this;
			};
		}
		if (!p.removeClass) {
			p.removeClass = function(c) {
				const e = this.className.split(' ');
				const arr = c.split(' ');
				const ele = this;
				if (!e.length) {
					return;
				}
				arr.forEach(cur => {
					if (cur && ele.hasClass(cur)) {
						e.splice(e.indexOf(cur), 1);
						ele.className = e.join(' ');
					}
				});
				return this;
			};
		}
		if (!p.toggleClass) {
			p.toggleClass = function(c) {
				const arr = c.split(' ');
				const ele = this;
				arr.forEach(cur => {
					if (!cur) {
						return;
					}
					if (ele.hasClass(cur)) {
						ele.removeClass(cur);
					} else {
						ele.addClass(cur);
					}
				});
				return this;
			};
		}
	}
	if (!pl.hasClass) {
		pl.hasClass = function (c, all = true) {
			for (let i = this.length - 1; i >= 0; --i) {
				const hc = this[i].hasClass(c);
				if (all && !hc) return false;
				if (!all && hc) return true;
			}
			return true;
		};
	}
	if (!pl.addClass) {
		pl.addClass = function (c) {
			for (let i = 0; i < this.length; ++i) {
				this[i].addClass(c);
			}
		};
	}
	if (!pl.removeClass) {
		pl.removeClass = function (c) {
			for (let i = 0; i < this.length; ++i) {
				this[i].removeClass(c);
			}
		};
	}
	if (!pl.toggleClass) {
		pl.toggleClass = function (c) {
			for (let i = 0; i < this.length; ++i) {
				this[i].toggleClass(c);
			}
		};
	}
})();
