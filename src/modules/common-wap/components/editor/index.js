import commentEditor from './commentEditor.vue';

export default {
	functional: true,
	render (h, context) {
		// 默认为评论编辑器，如果增加其他类型的编辑器，请用props.type值区分
		return h(commentEditor, context.data);
	}
};
