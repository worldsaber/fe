<template>
  <span :class="cls"></span>
</template>
<script>
	import { mapGetters } from 'vuex';

	export default {
		props: {
			id: {
				required: true,
				type: String
			}
		},
		name: 'Checkbox',
		computed: {
			...mapGetters('sidebar', ['mapTournament']),
			cls () {
				return [
					'checkbox',
					{
						active: !!this.mapTournament[this.id]
					}
				];
			}
		}
	};
</script>
