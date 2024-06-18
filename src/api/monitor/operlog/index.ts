import { defHttp } from '/@/utils/http/axios';
import { IDS, PageQuery } from '@/api/base';
import { OperateLog } from './model';

enum Api {
  root = '/monitor/operlog',
  operLogList = '/monitor/operlog/list',
  operLogExport = '/monitor/operlog/export',
  operLogClean = '/monitor/operlog/clean',
}

export function operLogList(params?: PageQuery) {
  return defHttp.get<OperateLog>({ url: Api.operLogList, params });
}

export function operLogDelete(operIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + operIds });
}

export function operLogClean() {
  return defHttp.deleteWithMsg<void>({ url: Api.operLogClean });
}

export function operLogExport() {
  // 一定要加 responseType: 'blob'
  // 一定要加 responseType: 'blob'
  // 一定要加 responseType: 'blob'
  // 否则拿到的是string
  return defHttp.post<Blob>(
    { url: Api.operLogExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}
