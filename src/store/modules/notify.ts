import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useGlobSetting } from '@/hooks/setting';
import { useWebSocket } from '@vueuse/core';
import { getToken } from '@/utils/auth';
import { isDevMode } from '/@/utils/env';
import { tabListData, TabItem } from '@/layouts/default/header/components/notify/data';
import dayjs from 'dayjs';
import { isUrl } from '@/utils/is';
// import { useMessage } from '@/hooks/web/useMessage';

interface NotifyState {
  enable: boolean;
  listData: TabItem[];
}

const { websocketEnable } = useGlobSetting();

export const useNotifyStore = defineStore('notify', {
  state: (): NotifyState => ({
    enable: websocketEnable,
    listData: tabListData,
  }),
  getters: {
    count(state) {
      let count = 0;
      for (let i = 0; i < state.listData.length; i++) {
        // 这里显示消息数量 使用删除线作为条件
        count += state.listData[i].list.filter((item) => !item.titleDelete).length;
      }
      return count;
    },
  },
  actions: {
    listeningMessage() {
      if (!this.enable) {
        console.log('当前未开启websocket.');
        return;
      }
      const { apiUrl, urlPrefix, clientId, websocketUrl = '' } = useGlobSetting();
      // 直接使用连接
      const baseUrl = urlPrefix ? `${apiUrl}${urlPrefix}` : apiUrl;
      let wsUrl = isDevMode() ? websocketUrl : baseUrl;
      if (isUrl(wsUrl)) {
        wsUrl = wsUrl.replace('https://', '');
        wsUrl = wsUrl.replace('http://', '');
      }
      let websocketAddr = `protocol://${wsUrl}/resource/websocket?clientid=${clientId}&Authorization=Bearer ${getToken()}`;
      if (window.location.protocol.includes('https')) {
        websocketAddr = websocketAddr.replace('protocol://', 'wss://');
      } else {
        websocketAddr = websocketAddr.replace('protocol://', 'ws://');
      }

      // const { notification } = useMessage();
      useWebSocket(websocketAddr, {
        autoReconnect: false,
        heartbeat: true,
        onConnected() {
          console.log('websocket已经连接');
        },
        onDisconnected() {
          console.log('websocket已经断开');
        },
        onMessage: (_, message) => {
          console.log('接收到消息' + message.data);
          // 需要id不同 否则list foreach会有bug
          const id = 'notify-' + this.listData[0].list.length;
          this.listData[0].list.unshift({
            id,
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: message.data,
            description: '',
            datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: '1',
          });
        },
      });
    },
    clearAll() {
      this.listData = tabListData;
    },
    readAll() {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i].list.forEach((item) => {
          item.read = true;
          item.titleDelete = true;
        });
      }
    },
  },
  persist: true,
});

export function useNotifyStoreWithOut() {
  return useNotifyStore(store);
}
