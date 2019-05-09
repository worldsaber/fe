<template>
	<div class="sportbet-condition">
		<span class="condition-18">
			<svg xmlns="http://www.w3.org/2000/svg" width="33" height="38" viewBox="0 0 33 38">
				<g fill="none" fill-rule="evenodd">
					<g fill-rule="nonzero">
						<path fill="#FFF" stroke="#6A86C1" stroke-width="4" d="M2 3v33h29V11.062l-8.498-7.88z"/>
						<path fill="#393939" stroke="#393939" stroke-width="1.5" d="M16 13c0 .265-.067.52-.187.707-.119.188-.281.293-.45.293H7.637C7.285 14 7 13.552 7 13s.285-1 .637-1h7.726c.169 0 .33.105.45.293.12.187.187.442.187.707zm0 5c0 .265-.067.52-.187.707-.119.188-.281.293-.45.293H7.637C7.285 19 7 18.552 7 18s.285-1 .637-1h7.726c.169 0 .33.105.45.293.12.187.187.442.187.707z"/>
					</g>
					<path fill="#393939" d="M14.177 21.367l2.708 2.617a81.79 81.79 0 0 1 3.051-2.537c.5-.381.973-.763 1.43-1.106.458-.343.954-.702 1.484-1.08A84.29 84.29 0 0 1 26.157 17L27 18.144a20.41 20.41 0 0 0-2.609 2.224 43.689 43.689 0 0 0-1.628 1.628 69.35 69.35 0 0 0-1.93 2.155c-1.145 1.34-2.7 3.242-4.196 5.382L11 23.93l3.177-2.563z"/>
				</g>
			</svg>
		</span>
		<span class="condtion-text">{{creditText}}</span>
	</div>
</template>
<script>
import { creditTextMap } from './util';

export default {
	data() {
		return {
			creditText: creditTextMap[window.country],
		};
	}
};
</script>


<style lang="less">
@import 'base/styles/variable.less';

.sportbet-condition{
	display: flex;
	margin: 30/@rem 16/@rem 50/@rem;
	justify-content: center;
	align-items: center;
	.condition-18{
		flex-basis: 40/@rem;
		margin-right: 10/@rem;
	}
	.condition-text{
		font-size: 12/@rem;
		color: #1b1e25;
	}
}

</style>

