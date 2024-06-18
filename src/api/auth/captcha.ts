import { defHttp } from '/@/utils/http/axios';

/**
 * 验证码相关
 */

enum Api {
  smsCode = '/resource/sms/code',
  emailCode = '/resource/email/code',
  captchaImage = '/auth/code',
}

/**
 * 发送短信验证码
 * @param phoneNumber 手机号
 * @returns
 */
export function sendSmsCode(phoneNumber: string) {
  return defHttp.get<void>({ url: Api.smsCode + '/' + phoneNumber });
}

/**
 * 发送邮件验证码
 * @param email 邮箱
 * @returns
 */
export function sendEmailCode(email: string) {
  return defHttp.get<void>({ url: Api.emailCode + '/' + email });
}

/**
 * @param img 图片验证码 需要和base64拼接
 * @param captchaEnabled 是否开启
 * @param uuid 验证码ID
 */
export interface CapchaResponse {
  img: string;
  captchaEnabled: boolean;
  uuid: string;
}

/**
 * 图片验证码
 * @returns
 */
export function captchaImage() {
  return defHttp.get<CapchaResponse>({ url: Api.captchaImage });
}
