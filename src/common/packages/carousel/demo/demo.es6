import Vue from 'vue';
import carousel from '../main';

new Vue({
	el: '#carousel',
	template: '<carousel :itemsList = list :carouselOps = ops></carousel>',
	components: {
		carousel
	},
	data: function () {
		return {
			list: [
				{
					link: 'https://i.epay.126.net/a/8a/static/share-1702.html',
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				},
				{
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				}
			],
			ops: {
				indicators: true,
				interval: 5000
			}
		};
	},
	created () {
		window.setTimeout(() => {
			this.list = [
				{
					link: 'https://i.epay.126.net/a/8a/static/share-1702.html',
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				},
				{
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				},
				{
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1484735717296_1.jpg'
				},
				{
					img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				}
			];
		}, 500);
	}
});
