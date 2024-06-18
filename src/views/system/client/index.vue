<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :pre-icon="IconEnum.ADD"
            @click="handleAdd"
            v-auth="'system:client:add'"
            >新增客户端</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(clientExport)"
            :disabled="!selected"
            v-auth="'system:client:remove'"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            :preIcon="IconEnum.EXPORT"
            color="warning"
            @click="downloadExcel(clientExport, '客户端信息')"
            ghost
            v-auth="'system:client:export'"
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
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'system:client:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:client:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除客户端[${record.clientKey}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ClientModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { clientList, clientExport, clientRemove } from '/@/api/system/client';
  import { downloadExcel } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';
  import ClientModal from './ClientModal.vue';
  import { formSchems, columns } from './client.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Post' });

  const [registerTable, { reload, reloadWithCallback, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    api: clientList,
    showIndexColumn: false,
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 6,
      },
    },
    columns: columns,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await clientRemove([record.id]);
    await reload();
  }
</script>

<style scoped></style>
