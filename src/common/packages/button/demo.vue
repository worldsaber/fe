<template>
	<div>
		<af-button :loading='true' extraType='danger'>
		</af-button> 
		<af-button extraType='success'>
			<i class="af-icon-upload"></i>
	    </af-button> 
		<af-button extraType='info' icon='edit'>
	    </af-button>
		<af-button extraType='primary' icon='delete' :disabled="true">
	    </af-button>
		<af-button extraType='warning' icon='share' @click="test">
	    </af-button>
	</div>
</template>

<script>
import { afButton } from './index';

export default {
	name: 'afbtnDemo',
	methods: {
		test (e) {
			console.log('Hello World!');
		}
	}
};
</script>

<style>
  
</style>
