import { defHttp } from '@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { TenantPackage } from './model';

enum Api {
  root = '/system/tenant/package',
  packageList = '/system/tenant/package/list',
  packageSelectList = '/system/tenant/package/selectList',
  packageExport = '/system/tenant/package/export',
  packageChangeStatus = '/system/tenant/package/changeStatus',
}

export function packageList(params?: PageQuery) {
  return defHttp.get<TenantPackage[]>({ url: Api.packageList, params });
}

// 下拉框
export function packageSelectList() {
  return defHttp.get<TenantPackage[]>({ url: Api.packageSelectList });
}

export function packageExport() {
  return defHttp.post<Blob>(
    { url: Api.packageExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

export function packageInfo(id: ID) {
  return defHttp.get<TenantPackage>({ url: Api.root + '/' + id });
}

export function packageAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function packageUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function packageChangeStatus(data: any) {
  // 主要是兼容renderSwitch
  const { packageId, status } = data;
  return defHttp.putWithMsg({ url: Api.packageChangeStatus, data: { packageId, status } });
}

export function packageRemove(ids: IDS) {
  return defHttp.deleteWithMsg({ url: Api.root + '/' + ids });
}
