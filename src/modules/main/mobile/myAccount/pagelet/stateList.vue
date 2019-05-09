<template>
	<div class="m-ac-form-wrap states-list-wrapper">
		<topNavBar :backClick="backHandler" id="top-navbar">
			<!-- 点击清空所选州和地区及选择状态	 -->
			<div slot="right" class="clear" @click="clearAll" v-if="selectedState||selectedArea">Clear</div>
		</topNavBar>
		<!-- tab键激活标志 -->
		<div :style="activeTab" class="active-tab"></div>
		<ul class="tabs">
			<!-- 第0级：国家tab -->
			<li class="country">
				<div class="content">
					<img :src="countryStuff[1]" class="flag">
					<span>{{countryStuff[0]}}</span>
				</div>
				<canvas id="arrow1"></canvas>
			</li>
			<!-- 第1级：州tab, 点击切换到州的选择，清空当前所选地区，当前所选州不清空 -->
			<li class="state" @click="clearArea">	
				<span :class="['content',selectedState&&!selectedArea?'active-words':'negtive-words']">{{selectedState || firstDegree}}</span>
				<canvas id="arrow2"></canvas>
			</li>
			<!-- 第2级：地区tab -->
			<li :class="['gov',selectedArea?'active-words':'negtive-words']">{{selectedArea || secondDegree}}</li>
		</ul>
		<!-- 选择列表，根据当前是否在选择州，切换列表显示内容为州列表/地区列表 -->
		<ul class="location-list">
			<li class="location" v-for="(item,i) in list" :key="i" @click="getLocation(item.state)">
				<div :class="['initial',{'fix':item.initial}]" v-if="choosingState">{{item.initial}}</div>
				<div class="name">{{item.state}}</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { LS } from 'storage';
import topNavBar from 'components/navbar';
import keFlag from 'components/layout/pagelate/footer/image/KenyaFlag.svg';
import ngFlag from 'components/layout/pagelate/footer/image/ngLogo.png';
import ghFlag from 'components/layout/pagelate/footer/image/ghLogo.png';
import { saveAccountItem } from '../js/helper';

const countryMap = {
	ke: ['Kenya', keFlag],
	ng: ['Nigeria', ngFlag],
	gh: ['Ghana', ghFlag]
};

export default {
	components: {
		topNavBar
	},
	data() {
		return {
			statesList: [], // 州列表
			areaList: [], // 地区列表
			selectedState: '', // 当前选中的州
			selectedArea: '', // 当前选中的地区
			country: window.country,
			choosingState: true, // 表示当前选择的是state还是area，用来判断tab高亮及列表显示内容。非ke sendData有值时、无值且已选了state时置为false，点击state tab、清空当前所选时置为true。
			areaTabWidth: 0, // 地区tab激活时的宽度
			stateTabWidth: 0, // 州tab激活时的宽度
		};
	},
	props: ['sendData'],
	computed: {
		list() {
			// 当前未做任何选择，或地区列表为空（即当前国家为ke，且sendData有值时）返回州列表；否则返回地区列表
			if (this.choosingState) return this.statesList;
			return this.areaList;
		},
		// 国家名称及国旗
		countryStuff() {
			return countryMap[this.country];
		},
		// tab激活标志的高亮显示位置
		activeTab() {
			if (this.choosingState) {
				return `width: ${+this.stateTabWidth}px; transform: translateX(${this.stateTabWidth - 6}px); display:block`; // eslint-disable-line
			}
			return `width: ${this.areaTabWidth + 6}px; transform: translateX(${this.stateTabWidth * 2 - 7}px); display:block`; // eslint-disable-line
		},
		// 第一、二级的名称
		firstDegree() {
			if (this.country === 'ke') return 'County';
			if (this.country === 'ng') return 'State';
			if (this.country === 'gh') return 'Region';
		},
		secondDegree() {
			if (this.country === 'ng') return 'Government';
			if (this.country === 'gh') return 'District';
		}
	},
	// canvas绘制tab箭头
	mounted () {
		this.drawArrow('arrow1');
		this.drawArrow('arrow2');
		this.stateTabWidth = document.querySelector('.state').clientWidth;
		this.areaTabWidth = document.querySelector('.tabs').clientWidth - document.querySelector('.country').clientWidth - this.stateTabWidth;
	},
	created() {
		// 取到州列表并保存
		this.getStateList();
		// sendData不为空时将历史记录填入tab
		if (this.sendData.value) {
			const sendData = this.sendData.value.split(', ');
			if (sendData.length > 1) { // 非ke，有地区选项时，获取地区列表并显示
				this.selectedState = sendData[0];
				this.selectedArea = sendData[1];
				this.choosingState = false;
				this.getAreaList(this.selectedState);
			} else {
				this.selectedState = sendData[0];
			}
		}
	},
	methods: {
		drawArrow(id) {
			const arrow = document.querySelector(`#${id}`);
			arrow.height = 46;
			arrow.width = 100;
			const ctx = arrow.getContext('2d');
			ctx.moveTo(94, 0);
			ctx.lineTo(100, 23);
			ctx.lineTo(94, 46);
			ctx.strokeStyle = '#e5e7ec';
			ctx.stroke();
		},
		// 第一级列表存localStorage，有记录就从里面取，不再发送请求
		getStateList() {
			if (LS.get(`statesList_${this.country}`)) {
				this.statesList = JSON.parse(LS.get(`statesList_${this.country}`));
				return;
			}
			fetch('/patron/locations').then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const statesList = []; // 保存ng，gh去重后的state
					const initialMap = {}; // 首字母去重
					const stateMap = {}; // ng，gh state去重
					// state去重
					res.data.forEach(item => {
						if (!stateMap[item.state]) {
							stateMap[item.state] = 1;
							statesList.push(item);
						}
					});
					// 取首字母
					statesList.forEach(item => {
						const initial = item.state.slice(0, 1).toLowerCase();
						if (!initialMap[initial]) {
							item.initial = initial;
							initialMap[item.initial] = 1;
						}
					});
					this.statesList = statesList;
					LS.set(`statesList_${this.country}`, JSON.stringify(statesList));
				}
			}).catch(e => console.log(e));
		},
		clearAll () { // 清空所选州、地区
			this.choosingState = true;
			this.selectedState = '';
			this.selectedArea = '';
		},
		clearArea() { // 清空所选地区
			this.choosingState = true;
			this.selectedArea = '';
		},
		backHandler () {
			this.$emit('backEvent', -1);
		},
		getAreaList(data) {
			fetch(`/patron/locations?state=${data}`).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					res.data.forEach(item => {
						item.state = item.area;
					});
					this.areaList = res.data;
				}
			}).catch(e => console.log(e));
		},
		getLocation(data) {
			// 国家为ke时，点击列表中任一项，更新个人信息，并带着更新后的个人信息回到个人信息页，返回不再往下执行
			if (this.country === 'ke') {
				this.selectedState = data;
				const param = { key: 'state', value: data };
				saveAccountItem(param).then(code => {
					if (code === 10000) {
						this.$toast('Succeeded');
						window.setTimeout(() => {
							this.$emit('backEvent', param);
						}, 2000);
					}
				});
				return;
			}
			// 国家不为ke时，如果choosingState为true，说明点击时选了第一级的某一项，此时将该值置为false，更新已选州，获取该州对应的地区列表
			if (this.choosingState) {
				this.choosingState = false;
				this.selectedState = data;
				this.getAreaList(data);
				// 进行地区选择，更新状态及个人信息
			} else {
				this.selectedArea = data;
				const param = { key: 'location', state: this.selectedState, area: data }; // 接口变动，此时不传value, 传state和area,key改为location
				saveAccountItem(param).then(code => {
					if (code === 10000) {
						this.$toast('Succeeded');
						window.setTimeout(() => {
							this.$emit('backEvent', { key: 'state', value: `${this.selectedState}, ${data}` });
						}, 2000);
					}
				});
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';
@import 'base/styles/icon.less';

.states-list-wrapper {
	height: unset !important;
	position: absolute !important;
	min-height: 200vh;
	.clear {
		color: @linkBlue;
	}
	.active-words {
		color: @green;
	}
	.negtive-words {
		color: @darkGray;
	}
	.active-tab {
		border-top: 4/@rem solid @green;
		display: none;
	}
	.tabs {
		border-bottom: 1/@rem solid @fogGray;
		height: 44/@rem;
		display: flex;
		align-items: center;
		li {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			padding-left: 16/@rem;
			.content {
				position: absolute;
				max-width: 22%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
		.country {
			.flag {
				margin-right: 10/@rem;
				width: 22/@rem;
			}
		}
		.gov {
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			padding-right: 10/@rem;
		}
		
	}
	.location-list {
		.location {
			display: flex;
			flex-flow: column;
			.initial {
				padding-left: 16/@rem;
				box-sizing: border-box;
				color: @darkGray;
				background: @fogGray;
				font-size: 12/@rem;
			}
			.fix {
				height: 24/@rem;
				line-height: 24/@rem;
			}
			.name {
				height: 44/@rem;
				line-height: 44/@rem;
				padding-left: 16/@rem;
				font-size: 14/@rem;
			}
		}
	}
}
</style>
