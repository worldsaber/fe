<template>
	<div id="popup-select">
		<transition name="fade">
			<div class="popup-modal" v-if="isShow" @click="close"></div>
		</transition>
		<transition name="slide">
			<div class="select-container" v-if="isShow">
				<div class="m-close" @click="close">
					<div>
						<svg width="46px" height="22px" viewBox="0 0 46 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="Betslip-Success" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(564.000000, -37.000000) rotate(90)">
								<g id="Shape_Close" transform="translate(37.000000, 518.000000)">
									<path d="M22,0.360389693 L22,46 L1.61522369,26.0416306 C0.0531265221,24.4795334 0.0531265221,21.9468735 1.61522369,20.3847763 L22,0.360389693 Z" id="Rectangle-34" fill="#353A45"></path>
									<polygon id="Shape" fill="#FFFFFF" fill-rule="nonzero" points="20.25 18.8075 19.1925 17.75 15 21.9425 10.8075 17.75 9.75 18.8075 13.9425 23 9.75 27.1925 10.8075 28.25 15 24.0575 19.1925 28.25 20.25 27.1925 16.0575 23"></polygon>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div class="content">
				<slot name="head">
					<div class="m-head">
						<div class="action" v-if="showActionBar">
							<span v-if="!isEdit" @click="toggleEdit(true)">Edit</span>
							<span v-else @click="toggleEdit(false)">Done</span>
						</div>
					</div>
				</slot>
				<slot name="prepend"></slot>
				<div class="m-body">
				  <ul class="select-list">
				    <li v-for="(item, index) in list" class="select-item" @click="select(index)">
					  <i class="item-left selected" v-if="!isEdit&&value===index"/>
					  <i class="item-left" v-if="!isEdit&&value!==index"/>
					  <div class="item-right">
					    <img class="item-icon" :src="propertyName.iconUrl?item[propertyName.iconUrl]:''">
						<div class="item-main">
							<div class="item-title" v-if="propertyName.title">{{item[propertyName.title]}}</div>
							<div class="item-desc" v-if="propertyName.desc">{{item[propertyName.desc]}}</div>
						</div>
						<i class="icon-delete" v-if="isEdit" @click="deleteItem(index)"/>
					  </div>
					</li>
				  </ul>
				</div>
				<slot name="append"></slot>
			</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			'default': 0
		},
		isShow: {
			type: Boolean,
			'default': false
		},
		showActionBar: {
			type: Boolean,
			'default': false
		},
		list: {
			type: Array,
			'default': () => []
		},
		propertyName: {
			type: Object,
			'default': () => ({
				iconUrl: 'iconUrl',
				title: 'title',
				desc: 'desc'
			})
		}
	},
	data() {
		return {
			isEdit: false
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		toggleEdit(val) {
			this.isEdit = val;
		},
		close() {
			this.isEdit = false;
			this.$emit('close');
		},
		select(index) {
			if (this.isEdit) {
				return;
			}
			this.$emit('input', index);
			this.$emit('change', index);
		},
		deleteItem(index) {
			this.$emit('delete', index);
		},
		disabledScroll() {
			const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
		},
		enableScroll() {
			const body = document.body;
    		body.style.position = '';
    		const top = body.style.top;
			document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top, 10);
    		body.style.top = '';
		}
	},
	watch: {
		isShow(val) {
			if (val) {
				this.disabledScroll();
			} else {
				this.enableScroll();
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";
body {
	width: 100%;
}
#popup-select {
	.popup-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: @dark;
		opacity: 0.4;
		overflow: hidden;
		z-index: 500;
	}
	.select-container {
		z-index: 501;
		position: fixed;
		width: 100%;
		height: 50%;
		bottom: 0;
		left: 0;
		background-color: @white;
		border-top: 6px solid @dark;
		.m-close {
			position: absolute;
			top: -28px;
			right: 26px;
			width: 46px;
			height: 22px;
		}
		.content{
			height: 100%;
			overflow-y: auto;
		}
		.m-head {
			.action {
				margin-top: 10/@rem;
				margin-bottom: 20/@rem;
				padding: 0 16/@rem;
				height: 19px;
	  			font-size: 16px;
	  			line-height: normal;
	  			text-align: right;
	  			color: @green;
			}
		}

		.m-body {
			.select-list {
				padding-left: 16/@rem;
				width: 100%;
				box-sizing: border-box;
				margin-top: 20/@rem;

				.select-item {
					display: flex;
					align-items: center;
					justify-content: center;

					.item-left {
						flex: 0 0 auto;
						margin-right: 16/@rem;
						width: 18/@rem;
						&.selected {
							.m-icon-success();
							&::before {
								font-size: 18/@rem;
								line-height: 1;
								color: @green;
							}
						}
					}
					.item-right {
						flex: 1 1 auto;
						display: flex;
						align-items: center;
						justify-content: center;
						text-align: left;
						padding: 14/@rem 0;
						box-sizing: border-box;
						border-bottom: 1px solid @fogGray;
						.item-icon {
							flex: 0 0 auto;
							height: 20px;
						}
						.item-main {
							flex: 1 1 auto;
							margin-left: 8/@rem;
							margin-right: 17/@rem;
						}

						.item-title {
							font-size: 14/@rem;
							line-height: 1;
							color: @dark;
						}

						.item-desc {
							font-size: 12/@rem;
							line-height: 1;
							margin-top: 6/@rem;
							color: @darkGray;
						}

						.icon-delete {
							flex: 0 0 auto;
							margin-right: 13/@rem;
							color: @red;
							.m-icon-delete();

							&:before {
								font-size: 14/@rem;
								line-height: 1;
							}
						}
					}
				}
			}
		}
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
	.slide-enter-active, .slide-leave-active {
		transition: all .3s ease;//cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-enter, .slide-leave-to {
		transform: translateY(100%);
		//opacity: 0;
	}
}
</style>
