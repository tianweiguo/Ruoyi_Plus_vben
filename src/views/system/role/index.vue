<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            pre-icon="zondicons:add-outline"
            @click="handleAdd"
            v-auth="'system:role:add'"
            >新增角色</a-button
          >
          <a-button
            preIcon="ic:outline-delete-outline"
            danger
            @click="multipleRemove(roleRemove)"
            :disabled="!selected"
            v-auth="'system:role:remove'"
            >选中删除</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            preIcon="solar:download-linear"
            color="warning"
            ghost
            v-auth="'system:role:export'"
            @click="downloadExcel(roleExport, '角色信息')"
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
                auth: 'system:role:edit',
                onClick: handleEdit.bind(null, record),
                ifShow: !record.superAdmin,
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:role:remove',
                ifShow: !record.superAdmin,
                popConfirm: {
                  placement: 'left',
                  title: `是否删除角色[${record.roleName}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
            :dropDownActions="[
              {
                label: '部门权限',
                icon: 'codicon:run-all',
                ifShow: !record.superAdmin,
                auth: 'system:role:edit',
                onClick: handleOpenAuth.bind(null, record),
              },
              {
                label: '分配用户(未完成)',
                icon: 'bx:comment-detail',
                auth: 'system:role:edit',
                ifShow: !record.superAdmin,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @reload="reloadWithCallback" />
    <RoleAuthModal @register="registerAuthModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { roleList, roleExport, roleRemove } from '/@/api/system/role';
  import { useModal } from '/@/components/Modal';
  import RoleModal from './RoleModal.vue';
  import RoleAuthModal from './RoleAuthModal.vue';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchems, columns } from './role.data';
  import { IconEnum } from '@/enums/appEnum';

  // 缓存
  defineOptions({ name: 'Role' });

  const [registerTable, { reload, reloadWithCallback, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: Recordable) => ({
        disabled: record.superAdmin,
      }),
    },
    showIndexColumn: false,
    api: roleList,
    rowKey: 'roleId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
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
    columns: columns,
    actionColumn: {
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();
  const [registerAuthModal, { openModal: openAuthModal }] = useModal();

  function handleOpenAuth(record: Recordable) {
    openAuthModal(true, { record });
  }

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await roleRemove([record.roleId]);
    await reload();
  }
</script>

<style scoped></style>
