import { defHttp } from '/@/utils/http/axios';

enum Api {
  status = '/system/websocket/status',
  send = '/system/websocket/send',
  list = '/system/websocket/list',
}

export function websocketStatus() {
  return defHttp.get<boolean>({ url: Api.status });
}

export function websocketSend(message: string) {
  return defHttp.postWithMsg<void>({ url: Api.send, data: { message } });
}

export function websocketSendSomeone(sessionKey: number, message: string) {
  return defHttp.postWithMsg<void>({ url: Api.send + `/${sessionKey}`, data: { message } });
}

export function websocketList() {
  return defHttp.get<any>({ url: Api.list });
}
