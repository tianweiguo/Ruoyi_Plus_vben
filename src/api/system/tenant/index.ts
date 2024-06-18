import { defHttp } from '@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { Tenant } from './model';

enum Api {
  root = '/system/tenant',
  tenantList = '/system/tenant/list',
  tenantExport = '/system/tenant/export',
  tenantStatus = '/system/tenant/changeStatus',
  tenantDynamic = '/system/tenant/dynamic',
  tenantDynamicClear = '/system/tenant/dynamic/clear',
  tenantSyncPackage = '/system/tenant/syncTenantPackage',
}

export function tenantList(params?: PageQuery) {
  return defHttp.get<Tenant[]>({ url: Api.tenantList, params });
}

export function tenantExport() {
  return defHttp.post(
    { url: Api.tenantExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

export function tenantInfo(id: ID) {
  return defHttp.get<Tenant>({ url: Api.root + '/' + id });
}

export function tenantAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function tenantUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function tenantStatusChange(data: any) {
  return defHttp.putWithMsg({ url: Api.tenantStatus, data });
}

export function tenantRemove(ids: IDS) {
  return defHttp.deleteWithMsg({ url: Api.root + '/' + ids });
}

// 动态切换租户
export function tenantDynamicToggle(tenantId: ID) {
  return defHttp.get<void>({ url: Api.tenantDynamic + '/' + tenantId });
}

// 清除 动态切换租户
export function tenantDynamicClear() {
  return defHttp.get<void>({ url: Api.tenantDynamicClear });
}

/**
 * 租户套餐同步
 * @param tenantId 租户id
 * @param packageId 套餐id
 * @param showMsg 是否显示成功信息
 * @returns
 */
export function tenantSyncPackage(tenantId: string, packageId: string, showMsg = true) {
  return defHttp.get(
    { url: Api.tenantSyncPackage, params: { tenantId, packageId } },
    { successMessageMode: showMsg ? 'message' : 'none' },
  );
}
