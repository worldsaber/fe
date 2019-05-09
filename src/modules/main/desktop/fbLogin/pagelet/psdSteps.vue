<template lang="html">
	<AfSteps :space="space" :active="active" finish-status="success" :showProcess="false" :processPad="56" :center="true">
	  <AfStep title="Add Mobile Number"></AfStep>
	  <AfStep title="Verify Mobile Number"></AfStep>
	  <AfStep title="Success"></AfStep>
	</AfSteps>
</template>

<script>
import 'components/steps';

export default {
	props: {
		space: {
			type: [String, Array],
			'default': '30%'
		},
		active: {
			type: Number,
			'default': 0
		}
	}
};
</script>
