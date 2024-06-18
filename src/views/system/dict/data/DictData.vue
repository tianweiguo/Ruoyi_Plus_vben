<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :pre-icon="IconEnum.ADD"
            :disabled="addBtnDisabled"
            @click="handleAdd"
            v-auth="'system:dict:add'"
            >新增数据</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(dictDataRemove)"
            :disabled="!selected"
            v-auth="'system:dict:remove'"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            :preIcon="IconEnum.EXPORT"
            color="warning"
            @click="downloadExcel(dictDataExport, '字典数据')"
            ghost
            v-auth="'system:dict:export'"
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
                auth: 'system:dict:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:dict:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除字典[${record.dictLabel}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DictDataModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { dictDataList, dictDataExport, dictDataRemove } from '/@/api/system/dict/dictData';
  import { downloadExcel } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';
  import DictDataModal from './DictDataModal.vue';
  import { columns, formSchems } from './dictData.data';
  import { IconEnum } from '@/enums/appEnum';
  import { watch, computed } from 'vue';

  interface Props {
    dictType?: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    dictType: '',
  });

  const emit = defineEmits(['update:dictType']);

  const [registerTable, { reload, reloadWithCallback, multipleRemove, selected, getForm }] =
    useTable({
      rowSelection: {
        type: 'checkbox',
      },
      showIndexColumn: false,
      api: dictDataList,
      rowKey: 'dictCode',
      useSearchForm: true,
      formConfig: {
        schemas: formSchems,
        labelWidth: 80,
        baseColProps: {
          span: 8,
        },
        async resetFunc() {
          // 这里也需要清空
          const { setFieldsValue } = getForm();
          await setFieldsValue({ dictType: '' });
          emit('update:dictType', '');
        },
        async submitFunc() {
          const { getFieldsValue } = getForm();
          // 查询时设置为相应的dictType
          emit('update:dictType', getFieldsValue().dictType);
          await reload();
        },
      },
      columns,
      actionColumn: {
        width: 200,
        title: '操作',
        key: 'action',
        fixed: 'right',
      },
    });

  watch(
    () => props.dictType,
    async (dictType) => {
      if (!dictType) return;
      await getForm().setFieldsValue({ dictType });
      await reload({ searchInfo: { dictType } });
    },
  );

  const addBtnDisabled = computed(() => {
    return !props.dictType;
  });

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      update: true,
      dictType: props.dictType,
    });
  }

  function handleAdd() {
    openModal(true, {
      update: false,
      dictType: props.dictType,
    });
  }

  async function handleDelete(record: Recordable) {
    await dictDataRemove([record.dictCode]);
    await reload();
  }
</script>

<style scoped></style>
