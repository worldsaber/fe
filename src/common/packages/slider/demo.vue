<template lang='html'>
  <div class=''>
	  <AfSlider
	  	v-model="value"
	  	:width="width"
		:piecewise="piecewise"
		:piecewiseLabel="piecewiseLabel"
		:data="data"
		:piecewiseStyle="piecewiseStyle"
		:piecewiseActiveStyle="piecewiseActiveStyle"
		:labelActiveStyle="labelActiveStyle"
	  />
	  <div>{{value}}</div>

	  <br />
	  <br />
	  <hr />
	  <br />
	  <br />
	  <AfSlider
	  	v-model="value2"
		:lazy="true"
		:piecewise="true"
		:piecewiseLabel="true"
	  />
	  <div class="">{{value2}}</div>

	  <br />
	  <br />
	  <hr />
	  <br />
	  <br />
	  <AfSlider
	  	v-model="value3"
		:data="data3"
	  />
	  <div class="">{{value3}}</div>
  </div>
</template>

<script>
import AfSlider from './index.js';

export default {
	data() {
		return {
			value2: 5,
			value: '2016-10-01',
			width: '80%',
			piecewise: true,
			piecewiseLabel: true,
			data: [
				'2016-10-01',
				'2016-10-02',
				'2016-10-03',
				'2016-10-04',
				'2016-10-05',
				'2016-10-06',
				'2016-10-07'
			],
			piecewiseStyle: {
				backgroundColor: '#ccc',
				visibility: 'visible',
				width: '12px',
				height: '12px'
			},
			piecewiseActiveStyle: {
				backgroundColor: '#3498db'
			},
			labelActiveStyle: {
				color: '#3498db'
			},
			data3: [
				'10-01',
				'10-02',
				'10-03',
				'10-04',
				'10-05',
				'10-06',
				'10-07',
				'10-08',
				'10-09',
				'10-10',
				'10-11',
				'10-12',
				'10-13',
				'10-14',
				'10-15',
				'10-16',
				'10-17',
				'10-18',
				'10-19',
				'10-20',
			],
			value3: [
				'10-01',
				'10-05'
			]
		};
	},
};
</script>
