import baseImg from './template_with_percent.png';

const currency = window.currency;

export default ({ selector, winnings = '0.00', percent = 0 }) => ({
	selector,
	width: 1200,
	height: 630,
	data: {
		imageList: [{
			src: baseImg
			// src: 'http://s.sporty.net/ke/main/res/share_win/template_with_percent.png'
		}],
		textList: [{
			x: 452,
			y: 227 + 35,
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
			x: 573,
			y: 204 + 17 + 47,
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
		}, {
			x: 599.5 + 70,
			y: 380 + 83 / 2,
			text: `${percent}%`,
			maxWidth: 141,
			font: {
				size: '63px',
				family: 'AvenirNext',
				weight: 'bold',
				lineHeight: '128px',
			},
			color: '#ffe600',
			textAlign: 'center',
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
