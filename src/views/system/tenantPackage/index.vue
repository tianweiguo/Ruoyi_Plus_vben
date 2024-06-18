<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            pre-icon="zondicons:add-outline"
            @click="handleAdd"
            v-auth="'system:tenantPackage:add'"
            >新增租户套餐</a-button
          >
          <a-button
            preIcon="ic:outline-delete-outline"
            danger
            @click="multipleRemove(packageRemove)"
            v-auth="'system:tenantPackage:remove'"
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
          v-auth="'system:tenantPackage:export'"
          @click="downloadExcel(packageExport, '租户套餐信息')"
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
                auth: 'system:tenantPackage:edit ',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                ghost: true,
                auth: 'system:tenantPackage:delete',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除租户套餐[${record.packageName}]?`,
                  confirm: handleRemove.bind(null, record),
                },
              },
            ]"
        /></template>
      </template>
    </BasicTable>
    <TenantPackageModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { packageList, packageRemove, packageExport } from '@/api/system/tenantPackage';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { columns, formSchemas } from './tenantPackage.data';
  import { IconEnum } from '@/enums/appEnum';
  import { Space } from 'ant-design-vue';
  import { downloadExcel } from '@/utils/file/download';
  import TenantPackageModal from './TenantPackageModal.vue';
  import { useModal } from '@/components/Modal';

  defineOptions({ name: 'TenantPackage' });

  const [registerTable, { reload, reloadWithCallback, selected, multipleRemove }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'packageId',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      baseColProps: {
        span: 8,
      },
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns,
    api: packageList,
    actionColumn: {
      width: 200,
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

  async function handleRemove(record: Recordable) {
    await packageRemove([record.packageId]);
    await reload();
  }
</script>
<style scoped></style>
