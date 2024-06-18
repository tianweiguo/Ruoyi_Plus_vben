import { defHttp } from '/@/utils/http/axios';
import { IDS, PageQuery } from '@/api/base';
import { LoginLog } from './model';

enum Api {
  root = '/monitor/logininfor',
  loginInfoList = '/monitor/logininfor/list',
  loginInfoExport = '/monitor/logininfor/export',
  userUnlock = '/monitor/logininfor/unlock',
  loginInfoClean = '/monitor/logininfor/clean',
}

export function loginInfoList(params?: PageQuery) {
  return defHttp.get<LoginLog>({ url: Api.loginInfoList, params });
}

export function loginInfoExport() {
  return defHttp.post<Blob>(
    { url: Api.loginInfoExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

export function loginInfoRemove(infoIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + infoIds });
}

export function userUnlock(username: string) {
  return defHttp.get<void>(
    { url: Api.userUnlock + '/' + username },
    { successMessageMode: 'message' },
  );
}

export function loginInfoClean() {
  return defHttp.deleteWithMsg<void>({ url: Api.loginInfoClean });
}
