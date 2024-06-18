<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            pre-icon="zondicons:add-outline"
            @click="handleAdd"
            v-auth="'system:tenant:add'"
            >新增租户</a-button
          >
          <a-button
            preIcon="ic:outline-delete-outline"
            danger
            @click="multipleRemove(tenantRemove)"
            v-auth="'system:tenant:remove'"
            :disabled="!selected"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <a-button
          :preIcon="IconEnum.EXPORT"
          color="warning"
          ghost
          v-auth="'system:tenant:export'"
          @click="downloadExcel(tenantExport, '租户信息')"
          >导出数据</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'system:tenant:edit ',
                onClick: handleEdit.bind(null, record),
                ifShow: record.id !== 1,
              },
              {
                label: '同步',
                icon: IconEnum.SYNC,
                type: 'primary',
                ghost: true,
                auth: 'system:tenant:edit ',
                onClick: handleSync.bind(null, record),
                ifShow: record.id !== 1,
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                ghost: true,
                auth: 'system:tenant:delete',
                ifShow: record.id !== 1,
                popConfirm: {
                  placement: 'left',
                  title: `是否删除租户[${record.companyName}]?`,
                  confirm: handleRemove.bind(null, record),
                },
              },
            ]"
        /></template>
      </template>
    </BasicTable>
    <TenantModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { tenantList, tenantRemove, tenantSyncPackage, tenantExport } from '@/api/system/tenant';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, formSchemas } from './tenant.data';
  import { IconEnum } from '@/enums/appEnum';
  import { Space } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { downloadExcel } from '@/utils/file/download';
  import TenantModal from './TenantModal.vue';
  import { useModal } from '@/components/Modal';

  defineOptions({ name: 'Tenant' });

  const [registerTable, { reload, reloadWithCallback, selected, multipleRemove }] = useTable({
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: Recordable) => ({
        disabled: record.id === 1,
      }),
    },
    rowKey: 'id',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      baseColProps: {
        span: 8,
      },
      labelWidth: 100,
      // 日期选择格式化
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns,
    api: tenantList,
    actionColumn: {
      width: 300,
      title: '操作',
      key: 'action',
    },
  });

  const [registerModal, { openModal }] = useModal();
  function handleAdd() {
    openModal(true, { update: false });
  }
  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  const { createConfirm } = useMessage();
  async function handleSync(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: '同步套餐',
      content: `是否同步[${record.companyName}]的套餐?`,
      async onOk() {
        const { tenantId, packageId = '0' } = record;
        await tenantSyncPackage(tenantId, packageId);
        await reload();
      },
    });
  }
  async function handleRemove(record: Recordable) {
    await tenantRemove([record.id]);
    await reload();
  }
</script>
<style scoped></style>
