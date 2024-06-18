<template>
  <div>
    <BasicTable @register="tableRegister" @row-click="handleRowClick">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :preIcon="IconEnum.ADD"
            @click="handleAdd"
            v-auth="'system:dict:add'"
          >
            新增字典
          </a-button>
          <a-button
            danger
            :preIcon="IconEnum.DELETE"
            :disabled="!selected"
            v-auth="'system:dict:remove'"
            @click="multipleRemove(dictTypeRemove)"
          >
            多选删除
          </a-button>
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            type="warning"
            ghost
            :preIcon="IconEnum.EXPORT"
            @click="downloadExcel(dictExport, '字典信息')"
            v-auth="'system:dict:export'"
          >
            导出字典
          </a-button>
          <a-button
            :preIcon="IconEnum.REFRESH"
            @click="handleRefreshCache"
            v-auth="'system:dict:query'"
          >
            刷新缓存
          </a-button>
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :stopButtonPropagation="true"
            :actions="[
              {
                label: '编辑',
                type: 'primary',
                icon: IconEnum.EDIT,
                ghost: true,
                auth: 'system:dict:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                type: 'error',
                icon: IconEnum.DELETE,
                ghost: true,
                auth: 'system:dict:remove',
                popConfirm: {
                  title: `是否删除[${record.dictName}]`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DictTypeModal @register="registerModal" @reload="reloadWithCallback" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    dictList,
    dictExport,
    refreshDictTypeCache,
    dictTypeRemove,
  } from '/@/api/system/dict/dictType';
  import { Space } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { downloadExcel } from '/@/utils/file/download';
  import DictTypeModal from './DictTypeModal.vue';
  import { formSchemas, columns } from './dictType.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'DictType' });

  const emit = defineEmits<{
    (e: 'getDictType', dictType: string): void;
  }>();

  const [tableRegister, { reload, reloadWithCallback, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    rowKey: 'dictId',
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      labelWidth: 80,
      baseColProps: {
        span: 8,
      },
    },
    columns,
    api: dictList,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
    },
  });

  function handleRowClick(record: Recordable) {
    const { dictType } = record;
    emit('getDictType', dictType);
  }

  async function handleRefreshCache() {
    await refreshDictTypeCache();
    await reload();
  }

  const [registerModal, { openModal }] = useModal();

  function handleAdd() {
    openModal(true, { update: false });
  }

  function handleEdit(record: Recordable) {
    openModal(true, { update: true, record });
  }

  async function handleDelete(record: Recordable) {
    await dictTypeRemove([record.dictId]);
    await reload();
  }
</script>

<style scoped></style>
