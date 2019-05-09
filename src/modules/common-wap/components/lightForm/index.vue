<template>
	<div class="m-light-form">
		<form>
			<AfInput
				:placeholder="placeholder"
				v-model="code"
				icon="delete"
				:maxlength="maxlength"
				:error="isError"
				:iconClick="clearAllInput"
				@change="handleChange">
			</AfInput>

			<AfButton
				extraType="primary"
				:disabled="isDisabled"
				:loading="loading"
				@click.prevent="handleSubmit">
				<template v-if="loading"></template>
				<template v-else>{{btnText}}</template>
			</AfButton>

			<p class="m-code-err">{{errorInfo}}</p>
		</form>

		<div class="m-form-desc">
			<slot name="desc"></slot>
		</div>
	</div>
</template>

<script>
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';

export default {
	name: 'LightForm',
	components: {
		AfButton,
		AfInput
	},
	props: {
		placeholder: {
			type: String,
			'default': ''
		},
		maxlength: {
			type: Number,
			'default': 35
		},
		validate: {
			type: Function,
		},
		btnText: {
			type: String,
			'default': 'Submit'
		}
	},
	data () {
		return {
			code: '',
			errorInfo: '',
			loading: false,
		};
	},
	computed: {
		isError () {
			return this.errorInfo !== '';
		},
		isDisabled () {
			return !this.code || this.errorInfo !== '' || this.loading;
		}
	},
	methods: {
		clearAllInput () {
			this.errorInfo = '';
			this.code = '';
		},
		handleChange (data) {
			this.code = data.value.trim();
			if (this.code) {
				this.errorInfo = '';
			}
		},
		handleSubmit () {
			// 如果传了 validate 函数的话，就进行校验
			if (this.validate) {
				const errMsg = this.validate(this.code);
				if (errMsg) {
					this.errorInfo = errMsg;
					return;
				}
			}

			// 开始loading
			this.loading = true;

			// 提交表单值，进行业务处理
			this.$emit('submit', this.code);

			this.$on('stopLoading', () => {
				this.loading = false;
			});

			this.$on('success', () => {
				this.clearAllInput();
			});

			this.$on('error', msg => {
				this.errorInfo = msg;
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-light-form {
	form {
		display: block;
		width:100%;

		.m-input-wrapper{
			height: 40/@rem;
			width:67%;

			.m-input {
				font-size: 14/@rem;
				border: 1px solid #979797;
				border-radius: 2px;
				width:100%;
				height: 40/@rem;
				max-width: 100%;
				padding-right:0;
			}

			&--error {
				.m-input{
					box-sizing: border-box;
					border: 1px solid @red;
				}
			}

			&--active {
				.m-input{
					box-sizing: border-box;
					border: 1px solid @green;
				}
			}

			.m-input-icon {
				&:hover {
					color: @darkGray;
				}

				&::before {
					width: 18/@rem;
					font-size: 14/@rem;
				}

				&--clickable {
					&:hover {
						& + .m-input {
							border-color: @darkGray;
						}
					}
				}
			}
		}

		.af-button--primary {
			width: 30%;
			height: 40/@rem;
			float: right;
			color: @white;
			font-weight: bold;
			font-size: 14/@rem;
			border-radius: 2px;
			border: 0;
			background: @green;

			&.is-disabled,
			&.is-disabled:focus,
			&.is-disabled:hover{
				background: @midGray;
				color: @darkGray;
			}
		}

		.m-code-err {
			margin-top: 4/@rem;
			width: 100%;
			min-height: 14/@rem;
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @red;
		}
	}

	.m-form-desc {
		color: @darkGray;
		margin-top: 18/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
	}
}
</style>
