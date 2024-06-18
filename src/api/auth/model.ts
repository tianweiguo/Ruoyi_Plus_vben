export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @param companyName 租户/公司名称
 * @param domain 绑定域名(不带http(s)://) 可选
 * @param tenantId 租户id
 */
export interface TenantOption {
  companyName: string;
  domain?: string;
  tenantId: string;
}

/**
 * @param tenantEnabled 是否启用租户
 * @param voList 租户列表
 */
export interface TenantResp {
  tenantEnabled: boolean;
  voList: TenantOption[];
}

/**
 * 登录类型
 * password 密码
 * sms 短信
 * social 第三方oauth
 * email 邮箱
 * xcx 小程序
 */
type GrantType = 'password' | 'sms' | 'social' | 'email' | 'xcx';

/**
 * @description: 所有登录类型都需要用到的
 * @param clientId 客户端ID 这里为必填项 但是在login内部处理了 所以为可选
 * @param grantType 授权/登录类型
 * @param tenantId 租户id
 */
export interface BaseLoginParams {
  clientId?: string;
  grantType: GrantType;
  tenantId: string;
}

/**
 * @description: oauth登录需要用到的参数
 * @param socialCode 第三方参数
 * @param socialState 第三方参数
 * @param source 与后端的 justauth.type.xxx的回调地址的source对应
 */
export interface OAuthLoginParams extends BaseLoginParams {
  socialCode: string;
  socialState: string;
  source: string;
}

/**
 * @description: 验证码登录需要用到的参数
 * @param code 验证码 可选(未开启验证码情况)
 * @param uuid 验证码ID 可选(未开启验证码情况)
 * @param username 用户名
 * @param password 密码
 */
export interface SimpleLoginParams extends BaseLoginParams {
  code?: string;
  uuid?: string;
  username: string;
  password: string;
}

export type LoginParams = SimpleLoginParams | OAuthLoginParams;

/**
 * @description: 登录结果
 * @field expire_in 过期时间(秒) 普通登录会返回 oauth不会返回
 */
export interface LoginResult {
  scope?: string;
  openid?: string;
  access_token: string;
  refresh_token?: string;
  expire_in?: number;
  refresh_expire_in?: number;
  client_id?: string;
}

/**
 * @description 用户信息 只保留能用到的
 * @param userId 用户id
 * @param userName 用户名
 * @param nickName 昵称
 * @param avatar 头像
 * @param createTime 创建时间
 */
export interface UserInfo {
  userId: string | number;
  userName: string;
  nickName: string;
  avatar?: string;
  createTime: string;
}
/**
 * @param roles 角色列表
 * @param user 用户信息
 * @param permissions 权限列表
 */
export interface UserInfoResult {
  roles: string[];
  user: UserInfo;
  permissions: string[];
}

/***
 * @description: 菜单meta
 * @param title 菜单名
 * @param icon 菜单图标
 * @param noCache 是否不缓存
 * @param link 外链链接
 */
export interface MenuMeta {
  title: string;
  icon: string;
  noCache: boolean;
  link?: string;
}

/**
 * @description: 菜单
 * @param name 菜单名
 * @param path 菜单路径
 * @param hidden 是否隐藏
 * @param component 组件名称 Laout
 * @param alwaysShow 总是显示
 * @param meta 路由信息
 * @param children 子路由信息
 */
export interface Menu {
  name: string;
  path: string;
  hidden: boolean;
  redirect?: string;
  component: string;
  alwaysShow?: boolean;
  meta: MenuMeta;
  children: Menu[];
}
