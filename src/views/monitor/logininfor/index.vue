<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(loginInfoRemove)"
            :disabled="!selected"
            v-auth="'monitor:logininfor:remove'"
            >选中删除</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            @click="handleClean"
            v-auth="'monitor:logininfor:remove'"
            >清空全部</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            :preIcon="IconEnum.EXPORT"
            color="warning"
            @click="downloadExcel(loginInfoExport, '登录日志')"
            ghost
            v-auth="'monitor:logininfor:export'"
            >导出数据</a-button
          >
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '详情',
                icon: IconEnum.DETAIL,
                type: 'primary',
                ghost: true,
                auth: 'monitor:logininfor:query',
                onClick: handleOpenModal.bind(null, record),
              },
              {
                label: '解锁',
                icon: IconEnum.UNLOCK,
                type: 'success',
                ghost: true,
                auth: 'monitor:logininfor:unlock',
                onClick: handleUnlock.bind(null, record),
                ifShow: () => record.status === '1',
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'monitor:logininfor:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除[${record.infoId}]-${record.userName}的登录日志?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <LoginInfoModal @register="registerModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import {
    loginInfoList,
    loginInfoExport,
    loginInfoRemove,
    userUnlock,
    loginInfoClean,
  } from '/@/api/monitor/logininfo';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { formSchems, columns } from './login.data';
  import { downloadExcel } from '@/utils/file/download';
  import { IconEnum } from '@/enums/appEnum';
  import { useModal } from '@/components/Modal';
  import LoginInfoModal from './LoginInfoModal.vue';

  defineOptions({ name: 'Logininfor' });

  const [registerTable, { reload, clearSelectedRowKeys, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showIndexColumn: false,
    api: loginInfoList,
    rowKey: 'infoId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      // 日期选择格式化
      fieldMapToTime: [
        [
          'dateTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
      baseColProps: {
        span: 8,
      },
    },
    columns: columns,
    actionColumn: {
      width: 230,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();
  function handleOpenModal(record: Recordable) {
    openModal(true, record);
  }

  async function handleUnlock(record: Recordable) {
    await userUnlock(record.userName);
    await reload();
  }

  async function handleDelete(record: Recordable) {
    await loginInfoRemove([record.infoId]);
    await reload();
  }

  const { createConfirm } = useMessage();
  function handleClean() {
    createConfirm({
      title: '提示',
      content: '是否清空登录日志?',
      iconType: 'warning',
      onOk: async () => {
        clearSelectedRowKeys();
        await loginInfoClean();
        await reload();
      },
    });
  }
</script>

<style scoped></style>
