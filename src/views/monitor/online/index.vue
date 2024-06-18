<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '强制退出',
                icon: 'ic:outline-logout',
                type: 'error',
                auth: 'monitor:online:forceLogout',
                ghost: true,
                onClick: handleForceLogout.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { onlineList, forceLogout } from '/@/api/monitor/online';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formSchems, columns } from './online.data';

  defineOptions({ name: 'Online' });

  const [registerTable, { reload }] = useTable({
    title: '在线用户列表',
    showIndexColumn: true,
    api: onlineList,
    rowKey: 'configId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
      },
    },
    columns: columns,
    actionColumn: {
      width: 160,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const { createConfirm, createMessage } = useMessage();

  async function handleForceLogout(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `确认要强制退出账号[${record.userName}]吗?`,
      onOk: async () => {
        await forceLogout(record.tokenId);
        await reload();
        createMessage.success(`退出用户账号[${record.userName}]成功`);
      },
    });
  }
</script>

<style scoped></style>
