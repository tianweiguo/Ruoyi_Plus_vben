import { defHttp } from '/@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { DictData } from './dictData.model';

enum Api {
  root = '/system/dict/data',
  dictDataList = '/system/dict/data/list',
  dictDataExport = '/system/dict/data/export',
}

/**
 * 主要是DictTag组件使用
 * @param dictType 字典类型
 * @returns
 */
export function dictDataInfo(dictType: string) {
  return defHttp.get<DictData[]>({ url: Api.root + '/type/' + dictType });
}

export function dictDataList(params?: PageQuery) {
  return defHttp.get<DictData[]>({ url: Api.dictDataList, params });
}

export function dictDataExport() {
  return defHttp.post<Blob>(
    { url: Api.dictDataExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

export function dictDataRemove(dictIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + dictIds });
}

export function dictDataAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function dictDataUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

// 查询字典数据详细
export function dictDetailInfo(dictCode: ID) {
  return defHttp.get<DictData>({ url: Api.root + '/' + dictCode });
}
