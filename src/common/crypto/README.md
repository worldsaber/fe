# 说明
## 加密解密算法，包括 aes和rsa

## rsa 非对称加密算法
### 方案1参考  [链接](https://github.com/cqingt/RSA_JS_PHP)
``` javascript
var rsa = new RSAKey();
//Exponent 一般都是10001  java 代码通过 publicKey.getPublicExponent().toString(16) 获取
//module要求是16进制的字符串 java 代码通过 publicKey.getModulus().toString(16) 获取
var modulus = 'abe449291e830f7afa346b88116d0d63c6ed42254826ceb90e2ee23066decaa23de01e743db26178662adfcc07f20304ec870613965b4b2116cd2e49ff2513919e8fd1151ed3604648d9cbea9e9cac9541c528a86d239fbc5a72a705014c4623451938a276e781f9ba622f347cf1c43c9d5e6b7cf39fab7491b3405d1be6e7bd';
var exponent = '10001';
rsa.setPublic(modulus, exponent);
// 注意这里加密后的字符串是 hex编码，如果需要base64，需要自己转换
var res = rsa.encrypt('曹test');

console.log(res);
```
### 方案2 通过 https://github.com/travist/jsencrypt 加密解密
``` javascript
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICdAIBADANBgkqhkiG9w0BAQEFAASCAl4wggJaAgEAAoGBAKvkSSkegw96+jRriBFtDWPG7UIlSCbOuQ4u4jBm3sqiPeAedD2yYXhmKt/MB/IDBOyHBhOWW0shFs0uSf8lE5Gej9EVHtNgRkjZy+qenKyVQcUoqG0jn7xacqcFAUxGI0UZOKJ254H5umIvNHzxxDydXmt885+rdJGzQF0b5ue9AgMBAAECgYB7KZE6Q0CJIQaR9NKEGe1UJr7tfCUcmVaDURiEsdDExEcthOSpKF0qlZn2zQyMXZlzmLPD6SH0zPq3fYlLpddEfPVTtr/4tRivwZP4MPXZ6MRuCpomVWUeZSeem3h3UPsnSHoUVexvLkEtWX6Ah2X4Hbkhpvu/5fXuGpMVvLoLgQJBANalduZxXZiE2mwVSitJ1sN4qRwCTDWj412d1PJysqbIJRqX7Rg2cmUQQ1c2GKi5PGWSaWb3nzOPaBrJedrx9c0CQQDNAiD7nm1jyTYy0J8jExmwhIBPo11vUoqXScsLdshpbOVhVBYMytSUMZjOGCJrLb3Z0y+bVfMilpTkjW8lFsmxAj9Ppxd4bJlO//4OHdhoN/56i0w2GKQvQ6IcG3XqgqXJPnyGYdqaIZpR5rcWpfyAoDzJdIuoqjtp5s27IwkVNrUCQGgx5cudKOHnmWlYSRmNkqf5oDFZyZpT7GaaNd2cwJ18oFTIZPCZglPTpWNSNuQcenqkcHTVyV5SBFjpXY0POPECQBCJAxrnt/DwhnTewysUy4OAba00D+E/h4lrvCX6zmGByxFpC2gWTa5f1/ZYm4nq+CAL3ZYpFsQ0Av37jIY2BGc=
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr5EkpHoMPevo0a4gRbQ1jxu1CJUgmzrkOLuIwZt7Koj3gHnQ9smF4ZirfzAfyAwTshwYTlltLIRbNLkn/JRORno/RFR7TYEZI2cvqnpyslUHFKKhtI5+8WnKnBQFMRiNFGTiidueB+bpiLzR88cQ8nV5rfPOfq3SRs0BdG+bnvQIDAQAB
-----END PUBLIC KEY-----`;

const crypt = new JSEncrypt();
//设置公钥，如果只是加密，只需要公钥
crypt.setPublicKey(publicKey);
// 设置私钥，如果需要解密则有用
crypt.setPrivateKey(privateKey);

var a = crypt.encrypt('test');

console.log(a);
console.log(crypt.decrypt('HB7/GOEaMmIqxulI3Z9euBUUsfdJUq2VMUAV1wVqfkW24FaMZQtmxDxT4i+J2+R8Qnw1JvAlwuszyriB9sK5MF/BfK+D4n7mqgbDSnZY8jYy2HSYXv+zUGaxnaOt962O+CeIfr/vFIZwkCvNfzEhVDCf0uCG2jYpN9IOJzZCwg0='));
```


### java 代码
``` java
// package com.transsnet.afbet.common.util;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * RSA公钥/私钥/签名工具包
 * </p>
 * <p>
 * 罗纳德·李维斯特（Ron [R]ivest）、阿迪·萨莫尔（Adi [S]hamir）和伦纳德·阿德曼（Leonard [A]dleman）
 * </p>
 * <p>
 * 字符串格式的密钥在未在特殊说明情况下都为BASE64编码格式<br/>
 * 由于非对称加密速度极其缓慢，一般文件不使用它来加密而是使用对称加密，<br/>
 * 非对称加密算法可以用来对对称加密的密钥加密，这样保证密钥的安全也就保证了数据的安全
 * </p>
 *
 * @author IceWee
 * @date 2012-4-26
 * @version 1.0
 */
public class RSAUtil {

    /**
     * 加密算法RSA
     */
    public static final String KEY_ALGORITHM = "RSA";

    /**
     * 签名算法
     */
    public static final String SIGNATURE_ALGORITHM = "MD5withRSA";

    /**
     * 获取公钥的key
     */
    private static final String PUBLIC_KEY = "RSAPublicKey";

    /**
     * 获取私钥的key
     */
    private static final String PRIVATE_KEY = "RSAPrivateKey";

    /**
     * RSA最大加密明文大小
     */
    private static final int MAX_ENCRYPT_BLOCK = 117;

    /**
     * RSA最大解密密文大小
     */
    private static final int MAX_DECRYPT_BLOCK = 128;

    /**
     * <p>
     * 生成密钥对(公钥和私钥)
     * </p>
     *
     * @return
     * @throws Exception
     */
    public static Map<String, Object> genKeyPair() throws Exception {
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        keyPairGen.initialize(1024);
        KeyPair keyPair = keyPairGen.generateKeyPair();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        System.out.println("publicKey Mod: "+publicKey.getModulus().toString(16));  
        System.out.println("publicKey Exp: "+publicKey.getPublicExponent().toString(16));  
        System.out.println("privateKey Mod: "+privateKey.getModulus().toString(16));  
        System.out.println("privateKey Exp: "+privateKey.getPrivateExponent().toString(16));

        Map<String, Object> keyMap = new HashMap<String, Object>(2);
        keyMap.put(PUBLIC_KEY, publicKey);
        keyMap.put(PRIVATE_KEY, privateKey);
        return keyMap;
    }

    /**
     * <p>
     * 用私钥对信息生成数字签名
     * </p>
     *
     * @param data 已加密数据
     * @param privateKey 私钥(BASE64编码)
     *
     * @return
     * @throws Exception
     */
    public static String sign(byte[] data, String privateKey) throws Exception {
        byte[] keyBytes = Base64.decodeBase64(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PrivateKey privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initSign(privateK);
        signature.update(data);
        return Base64.encodeBase64String(signature.sign());
    }

    /**
     * <p>
     * 校验数字签名
     * </p>
     *
     * @param data 已加密数据
     * @param publicKey 公钥(BASE64编码)
     * @param sign 数字签名
     *
     * @return
     * @throws Exception
     *
     */
    public static boolean verify(byte[] data, String publicKey, String sign)
            throws Exception {
        byte[] keyBytes = Base64.decodeBase64(publicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        PublicKey publicK = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initVerify(publicK);
        signature.update(data);
        return signature.verify(Base64.decodeBase64(sign));
    }

    /**
     * <P>
     * 私钥解密
     * </p>
     *
     * @param encryptedData 已加密数据
     * @param privateKey 私钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] decryptByPrivateKey(byte[] encryptedData, String privateKey)
            throws Exception {
        byte[] keyBytes = Base64.decodeBase64(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, privateK);
        //        int inputLen = encryptedData.length;
        //        ByteArrayOutputStream out = new ByteArrayOutputStream();
        //        int offSet = 0;
        //        byte[] cache;
        //        int i = 0;
        //        // 对数据分段解密
        //        while (inputLen - offSet > 0) {
        //            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
        //                cache = cipher.doFinal(encryptedData, offSet, MAX_DECRYPT_BLOCK);
        //            } else {
        //                cache = cipher.doFinal(encryptedData, offSet, inputLen - offSet);
        //            }
        //            out.write(cache, 0, cache.length);
        //            i++;
        //            offSet = i * MAX_DECRYPT_BLOCK;
        //        }
        //        byte[] decryptedData = out.toByteArray();
        //        out.close();
        return cipher.doFinal(encryptedData);
    }

    /**
     * <p>
     * 公钥解密
     * </p>
     *
     * @param encryptedData 已加密数据
     * @param publicKey 公钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] decryptByPublicKey(byte[] encryptedData, String publicKey)
            throws Exception {
        byte[] keyBytes = Base64.decodeBase64(publicKey);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key publicK = keyFactory.generatePublic(x509KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, publicK);
        int inputLen = encryptedData.length;
        //        ByteArrayOutputStream out = new ByteArrayOutputStream();
        //        int offSet = 0;
        //        byte[] cache;
        //        int i = 0;
        //        // 对数据分段解密
        //        while (inputLen - offSet > 0) {
        //            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
        //                cache = cipher.doFinal(encryptedData, offSet, MAX_DECRYPT_BLOCK);
        //            } else {
        //                cache = cipher.doFinal(encryptedData, offSet, inputLen - offSet);
        //            }
        //            out.write(cache, 0, cache.length);
        //            i++;
        //            offSet = i * MAX_DECRYPT_BLOCK;
        //        }
        //        byte[] decryptedData = out.toByteArray();
        //        out.close();
        //        return decryptedData;
        return cipher.doFinal(encryptedData);
    }

    /**
     * <p>
     * 公钥加密
     * </p>
     *
     * @param data 源数据
     * @param publicKey 公钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] encryptByPublicKey(byte[] data, String publicKey)
            throws Exception {
        byte[] keyBytes = Base64.decodeBase64(publicKey);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key publicK = keyFactory.generatePublic(x509KeySpec);
        // 对数据加密
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, publicK);
        //        int inputLen = data.length;
        //        ByteArrayOutputStream out = new ByteArrayOutputStream();
        //        int offSet = 0;
        //        byte[] cache;
        //        int i = 0;
        //        // 对数据分段加密
        //        while (inputLen - offSet > 0) {
        //            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
        //                cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
        //            } else {
        //                cache = cipher.doFinal(data, offSet, inputLen - offSet);
        //            }
        //            out.write(cache, 0, cache.length);
        //            i++;
        //            offSet = i * MAX_ENCRYPT_BLOCK;
        //        }
        //        byte[] encryptedData = out.toByteArray();
        //        out.close();
        //        return encryptedData;
        return cipher.doFinal(data);
    }

    /**
     * <p>
     * 私钥加密
     * </p>
     *
     * @param data 源数据
     * @param privateKey 私钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] encryptByPrivateKey(byte[] data, String privateKey)
            throws Exception {
        byte[] keyBytes = Base64.decodeBase64(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, privateK);
        //        int inputLen = data.length;
        //        ByteArrayOutputStream out = new ByteArrayOutputStream();
        //        int offSet = 0;
        //        byte[] cache;
        //        int i = 0;
        //        // 对数据分段加密
        //        while (inputLen - offSet > 0) {
        //            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
        //                cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
        //            } else {
        //                cache = cipher.doFinal(data, offSet, inputLen - offSet);
        //            }
        //            out.write(cache, 0, cache.length);
        //            i++;
        //            offSet = i * MAX_ENCRYPT_BLOCK;
        //        }
        //        byte[] encryptedData = out.toByteArray();
        //        out.close();
        //        return encryptedData;
        return cipher.doFinal(data);
    }

    /**
     * <p>
     * 获取私钥
     * </p>
     *
     * @param keyMap 密钥对
     * @return
     * @throws Exception
     */
    public static String getPrivateKey(Map<String, Object> keyMap)
            throws Exception {
        Key key = (Key) keyMap.get(PRIVATE_KEY);
        return Base64.encodeBase64String(key.getEncoded());
    }

    /**
     * <p>
     * 获取公钥
     * </p>
     *
     * @param keyMap 密钥对
     * @return
     * @throws Exception
     */
    public static String getPublicKey(Map<String, Object> keyMap)
            throws Exception {
        Key key = (Key) keyMap.get(PUBLIC_KEY);
        return Base64.encodeBase64String(key.getEncoded());
    }

   public static void main(String[] args) throws Exception {
    //    Map<String, Object> keyPair = genKeyPair();
    //     System.out.println("-----------------");
    //    System.out.println(getPrivateKey(keyPair));
    //     System.out.println("-----------------");
    //    System.out.println(getPublicKey(keyPair));
        String key = "MIICdAIBADANBgkqhkiG9w0BAQEFAASCAl4wggJaAgEAAoGBAKvkSSkegw96+jRriBFtDWPG7UIlSCbOuQ4u4jBm3sqiPeAedD2yYXhmKt/MB/IDBOyHBhOWW0shFs0uSf8lE5Gej9EVHtNgRkjZy+qenKyVQcUoqG0jn7xacqcFAUxGI0UZOKJ254H5umIvNHzxxDydXmt885+rdJGzQF0b5ue9AgMBAAECgYB7KZE6Q0CJIQaR9NKEGe1UJr7tfCUcmVaDURiEsdDExEcthOSpKF0qlZn2zQyMXZlzmLPD6SH0zPq3fYlLpddEfPVTtr/4tRivwZP4MPXZ6MRuCpomVWUeZSeem3h3UPsnSHoUVexvLkEtWX6Ah2X4Hbkhpvu/5fXuGpMVvLoLgQJBANalduZxXZiE2mwVSitJ1sN4qRwCTDWj412d1PJysqbIJRqX7Rg2cmUQQ1c2GKi5PGWSaWb3nzOPaBrJedrx9c0CQQDNAiD7nm1jyTYy0J8jExmwhIBPo11vUoqXScsLdshpbOVhVBYMytSUMZjOGCJrLb3Z0y+bVfMilpTkjW8lFsmxAj9Ppxd4bJlO//4OHdhoN/56i0w2GKQvQ6IcG3XqgqXJPnyGYdqaIZpR5rcWpfyAoDzJdIuoqjtp5s27IwkVNrUCQGgx5cudKOHnmWlYSRmNkqf5oDFZyZpT7GaaNd2cwJ18oFTIZPCZglPTpWNSNuQcenqkcHTVyV5SBFjpXY0POPECQBCJAxrnt/DwhnTewysUy4OAba00D+E/h4lrvCX6zmGByxFpC2gWTa5f1/ZYm4nq+CAL3ZYpFsQ0Av37jIY2BGc=";
        byte[] content = Base64.decodeBase64("jxLiLwzx/NZfO4Je/3XagNof06Q7MHoiBHnsb9fqdNkpglGzlK0j1897c+P2AbcN/XQF0/D6Y4/rOFf3vFNp2HPUut6e9RTLjQBQC8BgvDgaDJT6fuYqLdSRc/zm95WdkuiUBBgvvGQanYmNyVgfJBKDMdHckJpnesqte0aLscI=");
        String s = new String(decryptByPrivateKey(content, key));
        System.out.println(s);
   }

}
```


## aes 对称加密算法
``` javascript
// code.google.com/p/crypto-js 库地址
// 加密解密 iv和key必须是它内部的一个word类型，str要解码的字符串必须是base64字符串
// word类型可以通过 enc下的utf8或者base64得到
var key = CryptoJS.enc.Base64.parse('I66AndrK+Wrw/XjtBLaiZQ==');

var iv = CryptoJS.enc.Base64.parse('OB8S7YwHNhc4+bAPHv6M/g==');

var str = 'blSLs9pX5FVlAI9bTAwFPA==';

var decrypted = CryptoJS.AES.decrypt(str, key, {
	iv: iv,
	mode: CryptoJS.mode.CBC,
	padding: CryptoJS.pad.Pkcs7
});
console.log(decrypted.toString(CryptoJS.enc.Utf8));
```

``` javascript
// iv 和 加密后内容为一个 base64串，其中前16位是iv，这个时候只能先转成字符串，截取后在反转成base64
// 这里需要注意一定要用原生的base64方法，atob或者atop的polyfill，不能用兼容中文的base64去解析串，如果解析会出错
var data = 'OB8S7YwHNhc4+bAPHv6M/m5Ui7PaV+RVZQCPW0wMBTw=';
data = window.atob(data);
 // 16位
var key = CryptoJS.enc.Base64.parse(btoa(data.slice(16)));
var iv = CryptoJS.enc.Base64.parse(btoa(data.slice(0, 16)));
var str = btoa(data.slice(16));
var decrypted = CryptoJS.AES.decrypt(str, key, {
	iv: iv,
	mode: CryptoJS.mode.CBC,
	padding: CryptoJS.pad.Pkcs7
});
console.log(decrypted.toString(CryptoJS.enc.Utf8));

```

### java端代码
``` java
// package com.transsnet.afbet.common.util;

import org.apache.commons.codec.binary.Base64;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.nio.charset.Charset;  
/**
 * AES 加密工具类
 *
 * @auther houpu
 * @date 2017/8/17 13:20
 */
public class AESUtil {
// javac -cp .:./commons-codec.jar ./AESUtil.java
// java -cp .:./commons-codec.jar AESUtil
    // private static final Logger log = LoggerFactory.getLogger(AESUtil.class);

    private static final String SHA1PRNG = "SHA1PRNG";   // SHA1PRNG 强随机种子算法, 要区别4.2以上版本的调用方法
    private static final String KEY_ALGORITHM = "AES";   //AES 加密
    private static final String DEFAULT_CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding";   //默认的加密算法


    /**
     * 加密
     *
     * @param content
     * @param key
     * @return
     */
    public static String encrypt(String content, String key) {
        try {
            byte[] raw = Base64.decodeBase64(key);
            SecretKeySpec sKeySpec = new SecretKeySpec(raw, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            SecureRandom r = new SecureRandom();
            byte[] ivBytes = new byte[16];
            r.nextBytes(ivBytes);
            cipher.init(Cipher.ENCRYPT_MODE, sKeySpec, new IvParameterSpec(ivBytes));
            byte[] encrypted = cipher.doFinal(content.getBytes("utf-8"));
            System.out.println(1);
            System.out.println(Base64.encodeBase64String(ivBytes));
            System.out.println(Base64.encodeBase64String(encrypted));
            System.out.println(byteMerger(ivBytes, encrypted).length);
            System.out.println(join(byteMerger(ivBytes, encrypted), ","));
            System.out.println(2);
            return Base64.encodeBase64String(byteMerger(ivBytes, encrypted));
        } catch (Exception ex) {
            // log.error("AES decrypt error. ", ex);
        }

        return null;

    }
    public static String join( byte[] o , String flag ){
        StringBuffer str_buff = new StringBuffer();

        for(int i=0 , len=o.length ; i<len ; i++){
            str_buff.append( String.valueOf( o[i] ) );
            if(i<len-1)str_buff.append( flag );
        }

        return str_buff.toString();
    }
    /**
     * 解密
     *
     * @param base64Encrypted
     * @param key
     * @return
     */
    public static String decrypt(String base64Encrypted, String key) {
        try {
            byte[] raw = Base64.decodeBase64(key);
            SecretKeySpec sKeySpec = new SecretKeySpec(raw, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);

            byte[] encrypted = Base64.decodeBase64(base64Encrypted);
            byte[] ivByte = new byte[16];
            System.arraycopy(encrypted, 0, ivByte, 0, 16);
            cipher.init(Cipher.DECRYPT_MODE, sKeySpec, new IvParameterSpec(ivByte));
            byte[] decrypted = cipher.doFinal(encrypted, 16, encrypted.length - 16);
            return new String(decrypted, "utf-8");
        } catch (Exception ex) {
            // log.error("AES decrypt error. ", ex);
        }

        return null;
    }


    /**
     * 对密钥进行处理
     *
     * @param seed
     * @return
     * @throws Exception
     */
    public static byte[] getRawKey(byte[] seed) throws Exception {
        KeyGenerator kgen = KeyGenerator.getInstance(KEY_ALGORITHM);
        //for android
        SecureRandom sr = null;
        sr = SecureRandom.getInstance(SHA1PRNG);
        sr.setSeed(seed);
        kgen.init(128, sr); //256 bits or 128 bits,192bits
        //AES中128位密钥版本有10个加密循环，192比特密钥版本有12个加密循环，256比特密钥版本则有14个加密循环。
        SecretKey sKey = kgen.generateKey();
        byte[] raw = sKey.getEncoded();
        return raw;
    }

    public static byte[] byteMerger(byte[] byte_1, byte[] byte_2) {
        byte[] byte_3 = new byte[byte_1.length + byte_2.length];
        System.arraycopy(byte_1, 0, byte_3, 0, byte_1.length);
        System.arraycopy(byte_2, 0, byte_3, byte_1.length, byte_2.length);
        return byte_3;
    }
    public static void main(String[] args) throws Exception {
        // System.out.println(Base64.encodeBase64String("曹c建".getBytes()));
        String key = Base64.encodeBase64String(getRawKey("123".getBytes("utf-8")));
        System.out.println(key);
        String mi = AESUtil.encrypt("cjx", key);
        System.out.println(mi);
        System.out.println(AESUtil.decrypt(mi, key));        
    }

}
```


