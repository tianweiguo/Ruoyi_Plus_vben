<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :pre-icon="IconEnum.ADD"
            @click="handleAdd"
            v-auth="'system:dept:add'"
          >
            新增部门
          </a-button>
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button :preIcon="IconEnum.EXPAND" @click="expandAll">展开全部</a-button>
          <a-button :preIcon="IconEnum.COLLAPSE" @click="collapseAll">折叠全部</a-button>
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
                auth: 'system:dept:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '新增',
                icon: IconEnum.ADD,
                type: 'success',
                ghost: true,
                auth: 'system:dept:add',
                onClick: handleAdd.bind(null, record.deptId),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:dept:remove',
                ifShow: () => record.parentId !== 0,
                popConfirm: {
                  title: `是否删除部门[${record.deptName}]`,
                  placement: 'left',
                  confirm: handleRemove.bind(null, record.deptId),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deptList, deptRemove } from '@/api/system/dept';
  import { Dept } from '@/api/system/dept/model';
  import { Space } from 'ant-design-vue';
  import DeptModal from './DeptModal.vue';
  import { useModal } from '/@/components/Modal';
  import { nextTick } from 'vue';
  import { formSchems, columns } from './dept.data';
  import { listToTree } from '@/utils/helper/treeHelper';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Dept' });

  const [registerTable, { expandAll, collapseAll, reload, reloadWithCallback }] = useTable({
    isTreeTable: true,
    showTableSetting: true,
    api: deptList,
    pagination: false,
    rowKey: 'deptId',
    afterFetch(data: Dept[]) {
      return listToTree(data, { id: 'deptId', pid: 'parentId' });
    },
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
      },
    },
    columns: columns,
    actionColumn: {
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  function onFetchSuccess() {
    nextTick(expandAll);
  }

  const [registerModal, { openModal }] = useModal();

  function handleEdit(record: Dept) {
    const { deptId } = record;
    openModal(true, { deptId, update: true });
  }

  function handleAdd(deptId?: string | number) {
    openModal(true, { deptId, update: false });
  }

  async function handleRemove(deptId: string | number) {
    await deptRemove(deptId);
    await reload();
  }
</script>

<style scoped></style>
