import { defHttp } from '/@/utils/http/axios';
import { ID, IDS, PageQuery } from '/@/api/base';
import { OssConfig } from './model';

enum Api {
  root = '/resource/oss/config',
  ossConfigList = '/resource/oss/config/list',
  ossConfigChangeStatus = '/resource/oss/config/changeStatus',
}

export function ossConfigList(params: PageQuery) {
  return defHttp.get<OssConfig[]>({ url: Api.ossConfigList, params });
}

export function ossConfigInfo(ossConfigId: ID) {
  return defHttp.get<OssConfig>({ url: Api.root + '/' + ossConfigId });
}

export function ossConfigAdd(data: any) {
  return defHttp.postWithMsg<void>({ url: Api.root, data });
}

export function ossConfigUpdate(data: any) {
  return defHttp.putWithMsg<void>({ url: Api.root, data });
}

export function ossConfigRemove(ossConfigIds: IDS) {
  return defHttp.deleteWithMsg<void>({ url: Api.root + '/' + ossConfigIds });
}

export function ossConfigChangeStatus(data: any) {
  return defHttp.putWithMsg({ url: Api.ossConfigChangeStatus, data });
}
