<template>
  <aside class="nav-bar">
     <nav class="left-nav">
         <ul>
             <li :class="{'active':this.index === 'betting'}"><a :href="jackpotUrl">Sporty {{gameSize || '--'}}</a></li>
             <li :class="{'active':this.index === 'result'}"><a :href="jackpotRetUrl">Previous Results</a></li>
             <li><a :href="`${helpUrl}?nav=jackpot`">How to play</a></li>
         </ul>
     </nav>
  </aside>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			index: '',
			jackpotUrl: pagePath.jackpot,
			jackpotRetUrl: pagePath.jackpotResult,
			helpUrl: pagePath.help
		};
	},
	computed: {
		...mapState('jackpot', ['gameSize'])
	},
	methods: {
		getActive() {
			this.index = this.$route.name;
		},
	},
	mounted() {
		this.getActive();
	}
};
</script>
<style lang="less">
@import 'base/style/mixin.less';
@import 'base/style/icon.less';
.nav-bar{
    .left-nav{
        background-color: @dark;
        ul{
            font-size: 14px;
            line-height: 44px;
            li{
                display: block;
                height: 44px;
                color: @white;
                a{
                    color: inherit;
                    &:active,&:hover{
                        color:inherit;
                        text-decoration: none;
                    }
                    padding: 0 12px;
                    display: block;
                    position: relative;
                    .m-icon-arrow--right;
                    &:before{
                        color: #32CE62 ;
                        position: absolute;
                        right: 5px;
                        font-weight: bold;
                        font-size: 12px;
                    }
                    &:hover{
                        color: @black;
                        background: @midGreen;
                        &:before{
                           color:inherit;
                        }
                    }

                }
                &.active{
                    background: @green;
                    color: @white;
                    a{
                        &:before{
                            color: @white;
                        }
                    }

                }
            }
        }
    }
}

</style>
