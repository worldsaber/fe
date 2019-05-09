<template>
  <div class="m-promotion-wrap">
    <h1>Promotions</h1>
		<template v-if="!loading">
			<ul class="m-pm-list">
				<li v-for="item in list" :class="{'m-pm-finish': item.status === 90}">
					<div class="m-pm-mask" v-if="item.status === 90">Finished</div>
					<a :href="item.linkUrl" target="_blank">
						<img :src="item.imgUrl" />
						<div class="m-pm-period">{{item.showStartDate}} － {{item.showEndDate}}</div>
					</a>
				</li>
			</ul>
			<p class="m-pm-nolist" v-if="list.length == 0"><i class="m-icon--pageques"></i>There are currently no promotions available.</p>
		</template>
	</div>
</template>
<script>
import dateFormat from 'kernel/js/dateFormat';
import '../../mockData/promotions/index?debug';

export default {
	data () {
		return {
			list: [],
			loading: false,
		};
	},
	created () {
		this.getList();
	},
	methods: {
		getList () {
			this.loading = true;
			fetch('/promotion/v1/activities', {
				method: 'GET',
				body: {
					classify: 1
				}
			}).then(res => res.json())
			.then((data = {}) => {
				const code = data.bizCode;
				if (code === 10000) {
					this.formatDataList(data.data.entityList);
				}
				this.loading = false;
			});
		},
		formatDataList (list = []) {
			const len = list.length;
			for (let i = 0; i < len; i++) {
				list[i].showStartDate = dateFormat.format(list[i].activityStartTime, 'DD/MM/YYYY');
				list[i].showEndDate = dateFormat.format(list[i].activityEndTime, 'DD/MM/YYYY');
			}
			this.list = list;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';
.m-promotion-wrap{
  background: @white;
  margin: 10px auto 28px;
	padding:10px 21px 48px;
	min-height: 500px;
  h1{
    font-size: 36px;
    font-weight: bold;
    color:#3B404B;
    line-height: 49px;
    margin-bottom: 14px;
  }
}
.m-pm-list{
    margin: 0 auto;
		width: 660px;
    li{
      position: relative;
      height: 210px;
      margin-bottom: 26px;
      img{
        display: block;
        width: 100%;
        height:100%;
			}
		}
		.m-pm-mask{
			position: absolute;
      left: 0;
			top:0;
			z-index: 2;
			width:660px;
			height: 210px;
			line-height: 178px;
			background:rgba(0,0,0,.5);
			text-align: center;
			font-size: 32px;
			font-weight: bold;
			color:@white;
			text-shadow: 0 2px 11px rgba(0,0,0,.4);
		}
    .m-pm-period{
      position: absolute;
      left: 0;
      bottom:0;
      padding-left:9px;
      width: 651px;
      height: 32px;
      line-height: 32px;
      background:rgba(0,0,0,.8);
      color: @white;
			font-size: 16px;
			z-index: 3;
    }
	}
	.m-pm-nolist{
		padding:237px 0 269px;
		font-size: 16px;
		text-align: center;
		color: @darkGray;
		.m-icon--pageques{
			.m-icon-pageques();
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			&::before{
				font-size: 23px;
			}
		}
	}
</style>
