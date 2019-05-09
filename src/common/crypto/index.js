import base64 from 'base64';
import CryptoJS from './aes';
import RSAKey from './rsa';

// 公钥的modulus，公钥的 e即 exponent 是10001
const publicKeyModulus = 'c207d6f2db3fa03c7545b7e73d97550f30ef5c3019c4ba5f303fe7b1d2059c22eebde8a8cbd87310e91f84f7ecf697d365dfdb7ad5522b6fb185ea33281cf456ed845320a2e59cbaf507b1741554a478f7c21e06996018a20f00b0baffc65aeeb3b36193f6992b0f240ce84bce3bc07a4187d5ba5c5543884a6b624aab0507cf';

const exponent = '10001';

function hexToBase64(str) {
	return base64.btoa(String.fromCharCode.apply(null,
		str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' '))
	);
}
// 创建rsa对象
const rsa = new RSAKey();
rsa.setPublic(publicKeyModulus, exponent);
// const res = rsa.encrypt('test');
// console.log(res);
// console.log(111, hexToBase64(res));

export {
	// aes加密对象导出
	CryptoJS,
	// rsa加密所用
	RSAKey,
	// hex到base64
	hexToBase64,
	// 公钥modulus
	publicKeyModulus,
	// 公钥e
	exponent,
	// 已经创建好的rsa解密对象
	rsa
 };

// import { JSEncrypt } from './JSEncrypt';
//  const privateKey = `-----BEGIN RSA PRIVATE KEY-----
//  MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMIH1vLbP6A8dUW35z2XVQ8w71wwGcS6XzA/57HSBZwi7r3oqMvYcxDpH4T37PaX02Xf23rVUitvsYXqMygc9FbthFMgouWcuvUHsXQVVKR498IeBplgGKIPALC6/8Za7rOzYZP2mSsPJAzoS847wHpBh9W6XFVDiEprYkqrBQfPAgMBAAECgYBAdvZVbb6v8CZOaZFshzD9gRalnF2TXRBvKWxDSjIO9BQ6CGi8gUeJoMqWFQEn1L2ppTx4jRNl1xA2G9+vPh93hZ/9RptjpbQOXg+hAKa2m9ow/RoZMaapFEVvK7pE0Uf+sbHaloMe32vOW48nHD60Q52HBFiTabIORJ36xAUWIQJBAPB+heRSLMdkjiSmKS4rQNlnX1zcLJhACkgq4kDvVI6KCiehweH1dy6+C0PjswW1zAhx+v5ze0r32qiMidoVbzcCQQDOimljDx05+2yffNSfckrJGrXcwjrKz4H91DzW1a0JQxuR/2ZhgtY/gXlETz5rR729GNVTxQS9gKiuZe0wB4gpAkAn5zZcDe50HxEer5tBl9eouugtxjJ4CJgsJUFpOMy04d6ReNtsnIfr74h6+TrpBaMW+6KDubGJXNqhAMCWuNu9AkA+By9zQnzChxGuLC0m3Yo8Lzti2yoQ8pTViEHlOzLGT1MeW5eBvWtekyG6NBpI2bjP639VsxujVdpS1eWPwRNRAkEAtUvdbAmckFrTe8kp0k2ZTJlaWWgm7uHy28tSvSAVwzL/UGUbGcimIR/r9WB3RfjZEp8XnlvEB6ZsvgfVXg6Bhw==
//  -----END RSA PRIVATE KEY-----`;
//  const publicKey = `-----BEGIN PUBLIC KEY-----
//  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCB9by2z+gPHVFt+c9l1UPMO9cMBnEul8wP+ex0gWcIu696KjL2HMQ6R+E9+z2l9Nl39t61VIrb7GF6jMoHPRW7YRTIKLlnLr1B7F0FVSkePfCHgaZYBiiDwCwuv/GWu6zs2GT9pkrDyQM6EvOO8B6QYfVulxVQ4hKa2JKqwUHzwIDAQAB
//  -----END PUBLIC KEY-----`;
// const crypt = new JSEncrypt();
// // 设置公钥，如果只是加密，只需要公钥
// crypt.setPublicKey(publicKey);
// // 设置私钥，如果需要解密则有用
// crypt.setPrivateKey(privateKey);
// const a = crypt.encrypt('曹test');
// console.log(222, a);
// console.log(crypt.decrypt(hexToBase64(res)));
