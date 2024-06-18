import { defHttp } from '/@/utils/http/axios';

export interface CommandStats {
  name: string;
  value: string;
}

export interface Info {
  [key: string]: string;
}

export interface CacheInfo {
  dbSize: number;
  commandStats: CommandStats[];
  info: Info;
}

export function refisCacheInfo() {
  return defHttp.get<CacheInfo>({ url: '/monitor/cache' });
}
