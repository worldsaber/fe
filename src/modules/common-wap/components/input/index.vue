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
				return !!~['input', 'password', 'tel', 'search'].indexOf(val);
			}
		}
	},
	render(h, context) {
		let tpl;
		if (context.props.type === 'password') {
			tpl = ElementPassword;
		} else {
			tpl = ElementInput;
			context.data.attrs.type = context.props.type;
		}
		return context.parent.$createElement(
			tpl,
			context.data,
			context.children
		);
	}
};
</script>
