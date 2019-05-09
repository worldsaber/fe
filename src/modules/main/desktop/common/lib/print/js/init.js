
import Modal from './modal';
import Html from './html';
import keTemplateHtml from '../template/ke.tpl';
import ngTemplateHtml from '../template/ng.tpl';

let templateHtml = '';

switch (window.country) {
case 'ke':
	templateHtml = keTemplateHtml;
	break;
case 'ng':
	templateHtml = ngTemplateHtml;
	break;
default:
	templateHtml = ngTemplateHtml;
}

const printTypes = ['html'];

export default {
	init () {
		const params = {
			printable: null,
			type: 'html',
			header: null,
			headerStyle: 'font-weight: 300;',
			maxWidth: 800,
			// font: 'TimesNewRoman',
			font_size: '12pt',
			honorMarginPadding: true,
			honorColor: false,
			properties: null,
			gridHeaderStyle: 'font-weight: bold;',
			gridStyle: 'border: 1px solid lightgray; margin-bottom: -1px;',
			showModal: false,
			onLoadingStart () {},
			onLoadingEnd () {},
			modalMessage: 'Retrieving Document...',
			frameId: 'printJS',
			htmlData: '',
			documentTitle: 'Document',

			styles: ''
		};

		// Check if a printable document or object was supplied
		const args = arguments[0]; // eslint-disable-line
		if (args === undefined) {
			throw new Error('printJS expects at least 1 attribute.');
		}

		switch (typeof args) {
		case 'string':
			params.printable = encodeURI(args);
			params.type = arguments[1] || params.type; // eslint-disable-line
			break;

		case 'object':
			params.printable = args.printable;
			params.type = typeof args.type !== 'undefined' ? args.type : params.type;
			params.frameId = typeof args.frameId !== 'undefined' ? args.frameId : params.frameId;
			params.header = typeof args.header !== 'undefined' ? args.header : params.header;
			params.headerStyle = typeof args.headerStyle !== 'undefined' ? args.headerStyle : params.headerStyle;
			params.maxWidth = typeof args.maxWidth !== 'undefined' ? args.maxWidth : params.maxWidth;
			params.font = typeof args.font !== 'undefined' ? args.font : params.font;
			params.font_size = typeof args.font_size !== 'undefined' ? args.font_size : params.font_size;
			params.honorMarginPadding = typeof args.honorMarginPadding !== 'undefined' ? args.honorMarginPadding : params.honorMarginPadding;
			params.properties = typeof args.properties !== 'undefined' ? args.properties : params.properties;
			params.gridHeaderStyle = typeof args.gridHeaderStyle !== 'undefined' ? args.gridHeaderStyle : params.gridHeaderStyle;
			params.gridStyle = typeof args.gridStyle !== 'undefined' ? args.gridStyle : params.gridStyle;
			params.showModal = typeof args.showModal !== 'undefined' ? args.showModal : params.showModal;
			params.onLoadingStart = typeof args.onLoadingStart !== 'undefined' ? args.onLoadingStart : params.onLoadingStart;
			params.onLoadingEnd = typeof args.onLoadingEnd !== 'undefined' ? args.onLoadingEnd : params.onLoadingEnd;
			params.modalMessage = typeof args.modalMessage !== 'undefined' ? args.modalMessage : params.modalMessage;
			params.documentTitle = typeof args.documentTitle !== 'undefined' ? args.documentTitle : params.documentTitle;
			params.styles = args.styles || params.styles;
			params.htmlData = args.htmlData;
			break;
		default:
			throw new Error('Unexpected argument type! Expected "string" or "object", got ' + typeof args);
		}

		if (!params.printable) {
			throw new Error('Missing printable information.');
		}

		if (!params.type || typeof params.type !== 'string' || printTypes.indexOf(params.type.toLowerCase()) === -1) {
			throw new Error('Invalid print type. Available types are: pdf, html, image and json.');
		}

		// Check if we are showing a feedback message to the user (useful for large files)
		if (params.showModal) {
			Modal.show(params);
		}
		if (params.onLoadingStart) {
			params.onLoadingStart();
		}

		// To prevent duplication and issues, remove printFrame from the DOM, if it exists
		const usedFrame = document.getElementById(params.frameId);

		if (usedFrame) {
			usedFrame.parentNode.removeChild(usedFrame);
		}

		// Create iframe element
		const printFrame = document.createElement('iframe');

		// Hide iframe
		printFrame.setAttribute('style', 'width:0;height:0;padding:0;margin:0;border:none');

		// Set element id
		printFrame.setAttribute('id', params.frameId);

		// For non pdf printing, pass an empty html document to srcdoc (force onload callback)
		if (params.type !== 'pdf') {
			printFrame.srcdoc = `<html>
				<head>
					<title>${params.documentTitle}</title>
				</head>
				<body>${templateHtml}</body>
			</html>`;
		}

		if (params.styles) {
			printFrame.srcdoc = `<html>
				<head>
					<title>${params.documentTitle}</title>
					<style type="text/css">
						${params.styles}
					</style>
				</head>
				<body>${templateHtml}</body>
			</html>`;
		}

		if (params.type) {
			Html.print(params, printFrame);
		}
	}
};
