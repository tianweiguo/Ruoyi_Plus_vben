import { defHttp } from '/@/utils/http/axios';
import { ID, IDS, PageQuery } from '@/api/base';
import { Role, DeptResp } from './model';

enum Api {
  root = '/system/role',
  roleList = '/system/role/list',
  roleExport = '/system/role/export',
  roleDataScope = '/system/role/dataScope',
  roleChangeStatus = '/system/role/changeStatus',
  roleOptionSelect = '/system/role/optionselect',
  roleAllocatedList = '/system/role/authUser/allocatedList',
  roleUnallocatedList = '/system/role/authUser/unallocatedList',
  roleAuthCancel = '/system/role/authUser/cancel',
  roleAuthCancelAll = '/system/role/authUser/cancelAll',
  roleAuthSelectAll = '/system/role/authUser/selectAll',
  roleDeptTree = '/system/role/deptTree',
}

export function roleList(params?: PageQuery) {
  return defHttp.get<Role[]>({ url: Api.roleList, params });
}

export function roleExport() {
  return defHttp.post<Blob>(
    { url: Api.roleExport, responseType: 'blob' },
    { isTransformResponse: false },
  );
}

export function roleInfo(roleId: ID) {
  return defHttp.get<Role>({ url: Api.root + '/' + roleId });
}

export function roleAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function roleUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function roleChangeStatus(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.roleChangeStatus, data });
}

export function roleRemove(roleIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + roleIds });
}

/**
 * 更新数据权限
 * @param data
 * @returns
 */
export function roleDataScope(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.roleDataScope, data });
}

export function roleOptionSelect() {
  return defHttp.get({ url: Api.roleOptionSelect });
}

export function roleAllocatedList(params: any) {
  return defHttp.get({ url: Api.roleAllocatedList, params });
}

export function roleUnallocatedList(params: any) {
  return defHttp.get({ url: Api.roleUnallocatedList, params });
}

export function roleAuthCancel(data: any) {
  return defHttp.put({ url: Api.roleAuthCancel, data });
}

export function roleAuthCancelAll(roleId: string | number, userIds: string[] | number[]) {
  return defHttp.put({ url: Api.roleAuthCancelAll, data: { roleId, userIds } });
}

export function roleSelectAll(roleId: string | number, userIds: string[] | number[]) {
  return defHttp.put({ url: Api.roleAuthSelectAll, data: { roleId, userIds } });
}

/**
 * 部门树
 * @param roleId 角色id
 * @returns
 */
export function roleDeptTree(roleId: string | number) {
  return defHttp.get<DeptResp>({ url: Api.roleDeptTree + '/' + roleId });
}
