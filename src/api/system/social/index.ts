import { defHttp } from '@/utils/http/axios';

enum Api {
  root = '/system/social',
  socialList = '/system/social/list',
}

export function socialList() {
  return defHttp.get({ url: Api.socialList });
}

export function socialInfo(id: string | number) {
  return defHttp.get({ url: Api.root + '/' + id });
}
