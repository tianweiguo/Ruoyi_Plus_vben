import type { GlobConfig } from '/#/config';

import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_ADMIN_MONITOR_URL,
    VITE_GLOB_POWERJOB_URL,
    VITE_GLOB_RSA_PUBLIC_KEY,
    VITE_GLOB_APP_CLIENT_ID,
    VITE_GLOB_WEBSOCKET_ENABLE,
    VITE_GLOB_WEBSOCKET_URL,
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_TITLE.replace(/\s/g, '_').replace(/-/g, '_'),
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    // springadmin地址
    adminMonitorUrl: VITE_GLOB_ADMIN_MONITOR_URL,
    // powerjob地址
    powerjobUrl: VITE_GLOB_POWERJOB_URL,
    // RSA公钥
    rsaPublicKey: VITE_GLOB_RSA_PUBLIC_KEY,
    // 客户端key
    clientId: VITE_GLOB_APP_CLIENT_ID,
    // 是否开启websocket
    websocketEnable: VITE_GLOB_WEBSOCKET_ENABLE,
    // WEBSOCKET地址 不需要wb://  dev模式&开启需要填写 prod不需要填写
    websocketUrl: VITE_GLOB_WEBSOCKET_URL,
  };
  return glob as Readonly<GlobConfig>;
};
