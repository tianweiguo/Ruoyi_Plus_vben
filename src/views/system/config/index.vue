<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :pre-icon="IconEnum.ADD"
            @click="handleAdd"
            v-auth="'system:config:add'"
            >新增参数</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(configRemove)"
            :disabled="!selected"
            v-auth="'system:config:remove'"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            color="warning"
            ghost
            :preIcon="IconEnum.EXPORT"
            v-auth="'system:config:export'"
            @click="downloadExcel(configExport, '参数数据')"
            >导出数据</a-button
          >
          <a-button
            :preIcon="IconEnum.REFRESH"
            @click="handleRefresh"
            v-auth="'system:config:query'"
            >刷新缓存</a-button
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
                auth: 'system:config:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:config:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除[${record.configName}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ConfigModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { configList, configExport, configRefreshCache, configRemove } from '/@/api/system/config';
  import ConfigModal from './ConfigModal.vue';
  import { useModal } from '/@/components/Modal';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchems, columns } from './config.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Config' });

  const [registerTable, { reload, reloadWithCallback, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showIndexColumn: false,
    api: configList,
    rowKey: 'configId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      labelWidth: 80,
      // 日期选择格式化
      fieldMapToTime: [
        [
          'createTime',
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
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();

  async function handleRefresh() {
    await configRefreshCache();
    await reload();
  }

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await configRemove([record.configId]);
    await reload();
  }
</script>

<style scoped></style>
