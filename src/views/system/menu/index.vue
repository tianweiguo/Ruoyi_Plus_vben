<template>
  <PageWrapper dense>
    <BasicTable @register="tableRegister">
      <template #tableTitle>
        <Space>
          <a-button
            v-auth="'system:menu:add'"
            type="primary"
            pre-icon="zondicons:add-outline"
            @click="handleAdd"
            >新增菜单</a-button
          >
          <BasicHelp text="修改后是否刷新菜单栏" />
          <Switch
            v-model:checked="refreshMenuRef"
            checked-children="刷新"
            un-checked-children="不刷新"
          />
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
                onClick: handleEdit.bind(null, record),
                auth: 'system:menu:edit',
              },
              {
                label: '新增',
                icon: IconEnum.ADD,
                type: 'success',
                ghost: true,
                onClick: handleAdd.bind(null, record),
                auth: 'system:menu:add',
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:menu:delete',
                popConfirm: {
                  title: `是否删除菜单[${record.menuName}]?`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuModal @register="registerEditModal" @reload="reloadWithCallback" />
    <MenuModal @register="registerAddModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { menuList, menuRemove } from '/@/api/system/menu';
  import { Space, Switch } from 'ant-design-vue';
  import MenuModal from './MenuModal.vue';
  import { useModal } from '/@/components/Modal';
  import { IconEnum } from '/@/enums/appEnum';
  import { tableColumns, formSchemas } from './menu.data';
  import { listToTree } from '@/utils/helper/treeHelper';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useLocalStorage } from '@vueuse/core';
  import { BasicHelp } from '@/components/Basic/index';

  // eslint-disable-next-line vue/no-reserved-component-names
  defineOptions({ name: 'Menu' });
  /** 修改后是否刷新菜单栏 */
  const refreshMenuRef = useLocalStorage('refreshMenu', true);

  const [tableRegister, { expandAll, collapseAll, reload, reloadWithCallback }] = useTable({
    bordered: false,
    api: menuList,
    rowKey: 'menuId',
    isTreeTable: true,
    columns: tableColumns,
    useSearchForm: true,
    formConfig: {
      baseColProps: {
        span: 6,
      },
      schemas: formSchemas,
    },
    pagination: false,
    afterFetch(data: Recordable[]) {
      return listToTree(data, { id: 'menuId', pid: 'parentId' });
    },
    actionColumn: {
      width: 230,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerEditModal, { openModal: openEditModal }] = useModal();
  const [registerAddModal, { openModal: openAddModal }] = useModal();

  function handleEdit(record: Recordable) {
    openEditModal(true, { record, update: true });
  }

  function handleAdd(record?: Recordable) {
    const parentId = record ? record.menuId : 0;
    openAddModal(true, { record: { parentId }, update: false });
  }

  // 删除后刷新菜单栏 不使用location.reload整页刷新
  const { refreshMenu } = usePermission();

  async function handleDelete(record: Recordable) {
    await menuRemove([record.menuId]);
    await reload();
    if (refreshMenuRef.value) {
      await refreshMenu();
    }
  }
</script>

<style scoped></style>
