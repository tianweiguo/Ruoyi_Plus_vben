import { defHttp } from '/@/utils/http/axios';
import { TenantResp } from './model';
import { LoginParams, OAuthLoginParams, LoginResult, UserInfoResult } from './model';
import { Menu } from './model';
import { ErrorMessageMode } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  TenantList = '/auth/tenant/list',
  authBinding = '/auth/binding',
  authUnbinding = '/auth/unlock',
  authCallback = '/auth/social/callback',
  GetUserInfo = '/system/user/getInfo',
  GetRoutes = '/system/menu/getRouters',
}

/**
 * 获取租户列表 下拉框使用
 */
export function tenantList() {
  return defHttp.get<TenantResp>({ url: Api.TenantList });
}

const globSetting = useGlobSetting();
/**
 * @description 登录接口 可处理普通登录和oauth登录
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResult>(
    {
      url: Api.Login,
      encrypt: true,
      params: {
        ...params,
        clientId: globSetting.clientId,
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return defHttp.get<UserInfoResult>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

/**
 * 绑定第三方账号
 * @param source 绑定的来源
 * @returns 跳转url
 */
export function authBinding(source: string) {
  return defHttp.get<string>({ url: Api.authBinding + '/' + source });
}

/**
 * 取消绑定
 * @param id 数据库id
 */
export function authUnbinding(id: string) {
  return defHttp.deleteWithMsg<void>({ url: Api.authUnbinding + '/' + id });
}

/**
 * oauth授权回调
 * @param data oauth授权
 * @returns
 */
export function authCallback(data: OAuthLoginParams) {
  return defHttp.post<void>({ url: Api.authCallback, data });
}

/**
 * 用户登出
 * @returns
 */
export function doLogout() {
  return defHttp.post<void>({ url: Api.Logout });
}

/**
 * 获取对应用户的菜单
 * @returns
 */
export function getRoutes() {
  return defHttp.get<Menu[]>({ url: Api.GetRoutes });
}
