import { defHttp } from '/@/utils/http/axios';
import { UserProfile } from './model';
// import { ContentTypeEnum } from '@/enums/httpEnum';

enum Api {
  root = '/system/user/profile',
  updatePassword = '/system/user/profile/updatePwd',
  updateAvatar = '/system/user/profile/avatar',
}

/**
 * 用户个人主页信息
 * @returns
 */
export function userProfile() {
  return defHttp.get<UserProfile>({ url: Api.root });
}

/**
 * 更新用户个人主页信息
 * @param data
 * @returns
 */
export function userProfileUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

/**
 * 用户修改密码
 * @param data
 * @returns
 */
export function userUpdatePassword(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.updatePassword, data });
}

interface FileCallBack {
  name: string;
  file: File | Blob;
  filename: string;
}

/**
 * 用户更新个人头像
 * @param data
 * @returns
 */
export function userUpdateAvatar(fileCallback: FileCallBack) {
  // const { file, filename } = fileCallback;
  // const imageFile = new window.File([file], filename, { type: file.type });
  // const data = {
  //   avatarfile: imageFile,
  // };
  // return defHttp.post({
  //   url: Api.updateAvatar,
  //   data,
  //   headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
  // });
  const { file, filename } = fileCallback;
  return defHttp.uploadFile<{ imgUrl: string }>(
    {
      url: Api.updateAvatar,
    },
    { file, name: 'avatarfile', filename },
  );
}
