<script>
import ElementInput from './input.vue';
import ElementPassword from './password.vue';

export default {
	name: 'AfInput',
	functional: true,
	props: {
		type: {
			type: String,
			'default': 'input',
			validator(val) {
				return !!~['input', 'password'].indexOf(val);
			}
		}
	},
	render(h, context) {
		const tpl = context.props.type === 'input' ? ElementInput : ElementPassword;

		return context.parent.$createElement(
			tpl,
			context.data,
			context.children
		);
	}
};
</script>
