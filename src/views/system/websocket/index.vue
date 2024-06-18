<template>
  <PageWrapper title="websocket测试" content="这这里可以进行websocket测试 非官方功能">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button
          :pre-icon="IconEnum.ADD"
          type="primary"
          ghost
          @click="handleSendMsg(0)"
          :disabled="!enable"
        >
          发送全体消息
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '发送消息',
                icon: IconEnum.ADD,
                type: 'primary',
                ghost: true,
                disabled: !enable,
                onClick: handleSendMsg.bind(null, 1, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <SendMsgModal @reload="reloadWithCallback" @register="registerModal"
  /></PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { websocketList, websocketStatus } from './api';
  import { onMounted, ref } from 'vue';
  import { IconEnum } from '@/enums/appEnum';
  import SendMsgModal from './SendMsgModal.vue';
  import { useModal } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import { useMessage } from '@/hooks/web/useMessage';

  const [registerTable, { reloadWithCallback }] = useTable({
    showIndexColumn: true,
    api: websocketList,
    rowKey: 'userId',
    columns: [
      {
        title: '用户ID',
        dataIndex: 'userId',
      },
      {
        title: '用户账号',
        dataIndex: 'username',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
      },
      {
        title: '用户部门',
        dataIndex: 'deptName',
      },
    ],
    actionColumn: {
      width: 220,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();

  async function handleSendMsg(type: number, record?: Recordable) {
    const data = {
      type,
      nickname: record?.nickname,
      sessionKey: record?.userId,
    };
    openModal(true, data);
  }

  const enable = ref(true);
  const { websocketEnable } = useGlobSetting();
  const { createMessage } = useMessage();
  onMounted(async () => {
    const serverEnable = await websocketStatus();
    enable.value = websocketEnable && serverEnable;
    if (!enable.value) {
      createMessage.warn({ content: '未开启websocket功能' });
    }
  });
</script>

<style scoped></style>
