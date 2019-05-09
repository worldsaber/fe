import Browser from './browser';
import Modal from './modal';

const Print = {
	send: (params, printFrame) => {
		// Append iframe element to document body
		document.getElementsByTagName('body')[0].appendChild(printFrame);

		// Get iframe element
		const iframeElement = document.getElementById(params.frameId);

		// Wait for iframe to load all content
		printFrame.onload = () => {
			// Get iframe element document
			let printDocument = (iframeElement.contentWindow || iframeElement.contentDocument);
			if (printDocument.document) printDocument = printDocument.document;

			// Inject printable html into iframe body
			const insertElement = printDocument.getElementById('insert-main') || printDocument.body;
			insertElement.innerHTML = params.htmlData;
			const img = printDocument.querySelector('img');
			if (img) {
				loadImageAndFinishPrint(img, iframeElement, params);
			} else {
				finishPrint(iframeElement, params);
			}
		};
	}
};

function finishPrint(iframeElement, params) {
	iframeElement.focus();

	// If Edge or IE, try catch with execCommand
	if (Browser.isEdge() || (Browser.isIE())) {
		try {
			iframeElement.contentWindow.document.execCommand('print', false, null);
		} catch (e) {
			iframeElement.contentWindow.print();
		}
	}

	// Other browsers
	if (!Browser.isIE() && !Browser.isEdge()) {
		iframeElement.contentWindow.print();
	}

	// If we are showing a feedback message to user, remove it
	if (params.showModal) {
		Modal.close();
	}
	if (params.onLoadingEnd) {
		params.onLoadingEnd();
	}
}

function loadImageAndFinishPrint(img, iframeElement, params) {
	if (typeof img.naturalWidth === 'undefined' || img.naturalWidth === 0) {
		setTimeout(() => {
			loadImageAndFinishPrint(img, iframeElement, params);
		}, 500);
	} else {
		finishPrint(iframeElement, params);
	}
}

export default Print;
