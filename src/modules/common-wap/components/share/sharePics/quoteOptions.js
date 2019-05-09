import baseImg from './template_with_quote.png';

const currency = window.currency;

export default ({ selector, winnings = '0.00' }) => ({
	selector,
	width: 1200,
	height: 630,
	data: {
		imageList: [{
			src: baseImg
			// src: 'http://s.sporty.net/ke/main/res/share_win/template_with_quote.png'
		}],
		textList: [{
			x: 452,
			y: 180 + 35,
			text: currency,
			maxWidth: 117,
			font: {
				size: '70px',
				family: 'MyriadPro-Cond',
				weight: 'bold',
				lineHeight: '71px',
			},
			color: '#ffe600'
		}, {
			x: 579,
			y: 174 + 47,
			text: winnings,
			maxWidth: 600,
			font: {
				size: '94px',
				family: 'AvenirNext',
				weight: 'bold',
				lineHeight: '128px',
			},
			color: '#ffe600',
			// textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
			textShadow: {
				color: 'rgba(0, 0, 0, 0.5)',
				offsetX: 0,
				offsetY: 2,
				blur: 4
			}
		}]
	}
});
