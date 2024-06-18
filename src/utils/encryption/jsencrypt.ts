import JSEncrypt from 'jsencrypt';
// 密钥对生成 http://web.chacuo.net/netrsakeypair
import { useGlobSetting } from '/@/hooks/setting';

const globSetting = useGlobSetting();
const publicKey = globSetting.rsaPublicKey;

// 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
const privateKey = '**********';

/**
 * 加密
 * @param txt 需要加密的数据
 * @returns
 */
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(txt);
}

/**
 * 解密
 * @param txt 需要解密的数据
 * @returns
 */
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(txt);
}
