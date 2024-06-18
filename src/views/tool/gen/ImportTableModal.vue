<template>
  <BasicModal
    v-bind="$attrs"
    title="导入表"
    :width="900"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="clearFormFields"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { readyToGenList, getDataSourceNames, importTable } from '/@/api/tool/gen';
  import { FormSchema } from '/@/components/Form';

  defineOptions({ name: 'ImportTableModal' });
  const emit = defineEmits(['register', 'reload']);

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(async () => {
    // 有缓存 每次都得刷新
    await reload();
    const ret = await getDataSourceNames();
    const dataSourceOptions = ret.map((item) => ({ label: item, value: item }));
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
      align: 'left',
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
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
      defaultValue: 'master',
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
  ];

  const [registerTable, { reload, getForm, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    canResize: false,
    showIndexColumn: false,
    showTableSetting: false,
    api: readyToGenList,
    rowKey: 'tableName',
    useSearchForm: true,
    formConfig: {
      labelWidth: 60,
      schemas: formSchems,
      baseColProps: { span: 6 },
    },
    columns: columns,
  });

  async function handleSubmit() {
    try {
      const tables = getSelectRowKeys();
      if (tables.length === 0) {
        closeModal();
        return;
      }
      const { validate, resetFields } = getForm();
      modalLoading(true);
      const data = await validate();
      const dataSource = data.dataName;
      await importTable(tables.join(','), dataSource);
      await resetFields();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }

  async function clearFormFields() {
    const { resetFields } = getForm();
    clearSelectedRowKeys();
    await resetFields();
  }
</script>

<style lang="less" scoped></style>
