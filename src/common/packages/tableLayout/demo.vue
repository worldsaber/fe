<template lang="html">
	<div class="wrap">
		<AfTable>
			<AfTableRow v-for="value in 10" :key="value">
				<AfTableCell v-for="value in 5" :key="value">
					{{value}}
				</AfTableCell>
			</AfTableRow>
		</AfTable>

		<AfTable style="margin-top: 50px;" class="m-table--border">
			<AfTableRow v-for="value in 10" :key="value">
				<AfTableCell v-for="value in 5" :key="value">
					{{value}}
				</AfTableCell>
			</AfTableRow>
		</AfTable>

		<AfTable style="margin-top: 50px;" class="m-table--zebra">
			<AfTableRow v-for="value in 10" :key="value">
				<AfTableCell v-for="(value, index) in 5" :key="value">
					{{value}}
				</AfTableCell>
			</AfTableRow>
		</AfTable>


		<div>
			<AfTable style="margin-top: 50px;" class="m-table--border">
				<AfTableRow class="m-table-header">
					<AfTableCell>
						table title
					</AfTableCell>
					<AfTableCell>
						right info
					</AfTableCell>
				</AfTableRow>
			</AfTable>
			<AfTable class="m-table--border">
				<AfTableRow v-for="value in 10" :key="value">
					<AfTableCell v-for="(value, index) in 5" :key="value">
						{{value}}
					</AfTableCell>
				</AfTableRow>
			</AfTable>
		</div>
	</div>
</template>

<script>
import { AfTable, AfTableRow, AfTableCell } from './index.js';

export default {
};
</script>

<style lang="less">
.wrap {
	margin: 20px 50px;
}

.m-table--border {
	.m-table-cell {
		border: 1px solid lightblue;
	}
}

.m-table--zebra {
	.m-table-row {
		background: fadeout(red, 90%);

		&:nth-of-type(2n) {
			background: fadeout(red, 70%);
		}
	}
}

.m-table-cell {
	font-size: 14px !important;
}

.m-table-header {
	background: lightblue;

	.m-table-cell {
		border: none;
		padding: 0 10px;
		box-sizing: border-box;

		&:first-of-type {
			width: 70%;
			text-align: left;
		}

		&:last-of-type {
			width: 70%;
			text-align: right;
		}
	}
}
</style>
