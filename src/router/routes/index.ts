import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

// import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '/@/router/constant';

// import.meta.globEager() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (<any>modules[key]).default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/auth/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

export const socialCallbackRoute: AppRouteRecordRaw = {
  path: '/social-callback',
  name: 'socialCallback',
  component: () => import('/@/views/auth/social-callback/index.vue'),
  meta: {
    title: '授权登录页',
  },
};

export const OSSConfigRoute: AppRouteRecordRaw = {
  path: '/oss-config',
  component: LAYOUT,
  name: 'OssConfig',
  meta: {
    title: 'OSS配置管理',
    hidden: true,
  },
  children: [
    {
      path: 'index',
      component: () => import('/@/views/system/oss/OssConfig.vue'),
      name: 'OssConfigIndex',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:edit-outlined',
        title: 'OSS配置管理',
        dynamicLevel: 1,
      },
    },
  ],
};

export const EditGenerateRoute: AppRouteRecordRaw = {
  path: '/gen',
  component: LAYOUT,
  name: 'EditGenerate',
  meta: {
    title: '修改生成配置',
    hidden: true,
  },
  children: [
    {
      path: 'edit/:tableId',
      component: () => import('/@/views/tool/gen/EditGenerate.vue'),
      name: 'EditGenerateIndex',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ant-design:edit-outlined',
        title: '修改生成配置',
        activeMenu: '/tool/gen',
        dynamicLevel: 3,
      },
    },
  ],
};

const accountSetting: AppRouteRecordRaw = {
  path: '/account',
  name: 'AcoountInfo',
  component: LAYOUT,
  redirect: '/setting',
  meta: {
    hideMenu: true,
    title: '账号',
  },
  children: [
    {
      path: 'setting',
      name: 'AccountSettingPage',
      component: () => import('/@/views/auth/profile/index.vue'),
      meta: {
        title: '个人设置',
      },
    },
  ],
};

// Basic routing without permission
// 基本路由
// 未在后台添加的路由 通常是跳转用  这里不会在菜单栏显示  但是可以跳转访问
export const basicRoutes = [
  socialCallbackRoute,
  LoginRoute,
  RootRoute,
  // ...mainOutRoutes,
  OSSConfigRoute,
  EditGenerateRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  accountSetting,
];
