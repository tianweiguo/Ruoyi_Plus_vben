import { defHttp } from '/@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { DictType } from './dictType.model';

enum Api {
  root = '/system/dict/type',
  dictTypeList = '/system/dict/type/list',
  dictTypeExport = '/system/dict/type/export',
  dictTypeRefreshCache = '/system/dict/type/refreshCache',
  dictOptionSelctList = '/system/dict/type/optionselect',
}

export function dictList(params?: PageQuery) {
  return defHttp.get<DictType[]>({ url: Api.dictTypeList, params });
}

export function dictExport() {
  return defHttp.post<Blob>(
    {
      url: Api.dictTypeExport,
      responseType: 'blob',
    },
    {
      // 返回为二进制数据 不需要转换
      isTransformResponse: false,
    },
  );
}

export function dictTypeRemove(dictIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + dictIds });
}

/**
 * 刷新缓存
 * @returns
 */
export function refreshDictTypeCache() {
  return defHttp.deleteWithMsg<void>({ url: Api.dictTypeRefreshCache });
}

export function dictTypeAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function dictTypeUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function dictTypeInfo(dictId: ID) {
  return defHttp.get<DictType>({ url: Api.root + '/' + dictId });
}

/**
 * 下拉框  返回值和list一样
 * @returns
 */
export function dictOptionSelctList() {
  return defHttp.get<DictType[]>({ url: Api.dictOptionSelctList });
}
