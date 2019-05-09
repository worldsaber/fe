<template>
	<div class="container">
		<div class="grid" v-for="(item,i) in amount" :key="i">
			<div :class="['grid',colored(i)]"></div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			height: 25,
			width: 20,
			amount: [],
		};
	},
	methods: {
		colored(i) {
			if (i === 0 || i === 1 || i === 20 || i === 21) return 'block';
			if (i === 0 || i === 1 || i === 2 || i === 3) return 'bar';
			if (i === 0 || i === 1 || i === 21 || i === 22) return 'zigzag';
			if (i === 0 || i === 20 || i === 40 || i === 41) return 'L';
			if (i === 0 || i === 1 || i === 2 || i === 21) return 'ding';
		}
	},
	created() {
		for (let i = 1; i < 501; i++) {
			this.amount.push(i);
		}
		// const edgeContainer = [];
		// window.edgeContainer = edgeContainer;
		// for (let i = 1; i - 1 < this.height / 20; i++) {
		// 	for (let j = 1; j - 1 < this.width / 20; j++) {
		// 		const grid = document.createElement('div');
		// 		grid.setAttribute('id', `grid-${i}-${j}`);
		// 		grid.classList.add('grid');
		// 		document.querySelector('.container').appendChild(grid);
		// 		if (i === this.height / 20 || (j === 1 || j === this.width / 20)) {
		// 			window.edgeContainer.push(`grid-${i}-${j}`);
		// 		}
		// 	}
		// }
	}
};
</script>

<style>
.m-page-loading-wrap {
	display:none
}
	.container {
            color: gray;
            border: 10px double gray;
            width: 33.3%;
			text-align: center;
			overflow: auto;
        }

        p:first-child {
            margin-right: 200px;
        }

        .snake-area {
            width: 315px;
            height: 525px;
            margin: auto;
            padding-bottom: 10px
        }

        .grid {
            border-right: 1px solid gray;
            border-bottom: 1px solid gray;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            float: left;
        }

        .block {
            background: pink;
        }
        .bar {
            background: rgb(214, 18, 240);
        }
        .zigzag {
            background: rgb(240, 18, 155);
        }
        .L {
            background: rgb(238, 83, 178);
        }
        .ding {
            background: #f777ac;
        }
        p {
            display: inline-block;
        }
        .first-one {
            margin-right: 20px;
        }
        button {
            width: 100px;
            height: 21px;
            line-height: 18px;
            color: brown;
            font-weight: bold;
            font-size: 15px;
        }
        .statement-wrapper {
            background: orange;
            display: none;
            padding: 15px;
            opacity: 0.9;
            position: fixed;
            top: 40%;
            left: 16%;
            color: #fff;
        }
</style>
