/**
 * 上传文件
 * @param {String} url 					上传地址
 * @param {Object} body  				上传参数
 * @param {Function} progressListener 	上传进度回调
 */
function upload (url = '', body = {}, progressListener) {
	if (window.FormData) {
		const formData = new FormData();

		// eslint-disable-next-line
		for (const name in body) {
			formData.append(name, body[name]);
		}

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				}
			};
			xhr.onerror = err => reject(err);
			xhr.upload.addEventListener('progress', event => {
				if (event.lengthComputable) {
					const complete = (event.loaded / event.total * 100 || 0);
					progressListener && progressListener(complete);
				}
			});
			xhr.send(formData);
		});
	}
	return Promise.reject('No FormData');
}

// convert base64/URLEncoded data component to raw binary data held in a string
export function dataURItoBlob(dataURI) {
	const byteString = dataURI.split(',')[1];

	// separate out the mime component
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	const ia = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], { type: mimeString });
}

export default upload;
