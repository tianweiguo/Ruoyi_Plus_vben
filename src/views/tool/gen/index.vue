<template>
  <PageWrapper title="代码生成" dense>
    <template #headerContent>
      <Alert message="目前仅为预览版!并没有测试!" type="warning"> dsdsdsad </Alert>
      <a-button type="link" @click="openDocModal(true)">如何修改后端?</a-button>
    </template>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button type="primary" :pre-icon="IconEnum.IMPORT" @click="handleImport">导入</a-button>
          <a-button type="success" :pre-icon="IconEnum.ADD" :disabled="!selected" @click="batchGen"
            >选中生成</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="handleMultipleDelete"
            :disabled="!selected"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '预览',
                icon: IconEnum.PREVIEW,
                onClick: handlePreview.bind(null, record),
              },
              {
                label: '编辑',
                icon: IconEnum.EDIT,
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '同步',
                icon: IconEnum.SYNC,
                onClick: handleSync.bind(null, record),
              },
              {
                label: '生成代码',
                icon: IconEnum.DOWNLOAD,
                onClick: handleGenerate.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                popConfirm: {
                  placement: 'left',
                  title: `是否删除表[${record.tableName}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ImportTableModal @register="registerImportModal" @reload="reloadWithCallback" />
    <PreviewModal @register="registerPreviewModal" />
    <DocsModal @register="registerDocModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import { FormSchema } from '/@/components/Form';
  import { Space, Alert } from 'ant-design-vue';
  import { useLoading } from '/@/utils/components/loading';
  import { downloadByData } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';
  import { onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    generatedList,
    getDataSourceNames,
    genRemove,
    syncDb,
    batchGenCode,
  } from '/@/api/tool/gen';
  import ImportTableModal from './ImportTableModal.vue';
  import PreviewModal from './PreviewModal.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { IconEnum } from '@/enums/appEnum';
  import DocsModal from './docs/DocsModal.vue';

  const [registerDocModal, { openModal: openDocModal }] = useModal();

  defineOptions({ name: 'EditGenerateIndex' });

  onMounted(async () => {
    const ret = await getDataSourceNames();
    const dataSourceOptions = [{ label: '全部', value: '' }];
    const transOptions = ret.map((item) => ({ label: item, value: item }));
    dataSourceOptions.push(...transOptions);
    await getForm().updateSchema({
      field: 'dataName',
      componentProps: {
        options: dataSourceOptions,
      },
    });
  });

  const columns: BasicColumn[] = [
    {
      title: '表名称',
      dataIndex: 'tableName',
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
    },
    {
      title: '实体类',
      dataIndex: 'className',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ];

  const formSchems: FormSchema[] = [
    {
      label: '数据源',
      field: 'dataName',
      component: 'Select',
      defaultValue: '',
    },
    {
      label: '表名称',
      field: 'tableName',
      component: 'Input',
    },
    {
      label: '表描述',
      field: 'tableComment',
      component: 'Input',
    },
    {
      label: '创建时间',
      field: 'createTime',
      component: 'RangePicker',
    },
  ];

  const [
    registerTable,
    { reload, getSelectRowKeys, clearSelectedRowKeys, getForm, selected, reloadWithCallback },
  ] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    api: generatedList,
    rowKey: 'tableId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
      },
      // 日期选择格式化
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns: columns,
    actionColumn: {
      width: 500,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerImportModal, { openModal: openImportModal }] = useModal();

  function handleImport() {
    // 必须传参数惨能触发回调  第二个参数无意义 用Mounted会有问题
    openImportModal(true, true);
  }

  const [openLoading, closeLoading] = useLoading();
  async function batchGen() {
    try {
      openLoading();
      const params = getSelectRowKeys().join(',');
      const data = await batchGenCode(params);
      const timestamp = new Date().getTime();
      downloadByData(data, '批量代码生成-' + timestamp + '.zip');
    } finally {
      closeLoading();
    }
  }

  async function handleGenerate(record: Recordable) {
    try {
      openLoading();
      const data = await batchGenCode(record.tableId);
      const timestamp = new Date().getTime();
      downloadByData(data, '代码生成-' + timestamp + '.zip');
    } finally {
      closeLoading();
    }
  }

  const go = useGo();
  function handleEdit(record: Recordable) {
    go(`/gen/edit/${record.tableId}`);
  }

  function handleSync(record: Recordable) {
    createConfirm({
      title: '提示',
      content: `确认要强制同步"${record.tableName}"表结构吗？`,
      iconType: 'warning',
      onOk: async () => {
        await syncDb(record.tableId);
        clearSelectedRowKeys();
        await reload();
      },
    });
  }

  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  function handlePreview(record: Recordable) {
    openPreviewModal(true, record.tableId);
  }

  async function handleDelete(record: Recordable) {
    await genRemove([record.tableId]);
    await reload();
  }

  const { createConfirm } = useMessage();

  async function handleMultipleDelete() {
    const selectedRowKeys = getSelectRowKeys();
    createConfirm({
      title: '提示',
      content: `是否删除ID [${selectedRowKeys.join(', ')}]`,
      iconType: 'warning',
      onOk: async () => {
        await genRemove(selectedRowKeys as string[]);
        clearSelectedRowKeys();
        await reload();
      },
    });
  }
</script>

<style scoped></style>
