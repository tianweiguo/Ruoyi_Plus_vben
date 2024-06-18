import { defHttp } from '/@/utils/http/axios';
import { PageQuery } from '@/api/base';
import { OnlineUser } from './model';

enum Api {
  root = '/monitor/online',
  onlineList = '/monitor/online/list',
}

export function onlineList(params?: PageQuery) {
  return defHttp.get<OnlineUser[]>({ url: Api.onlineList, params });
}

export function forceLogout(tokenId: string) {
  return defHttp.delete<void>({ url: Api.root + '/' + tokenId });
}
