<template>
  <PageWrapper dense>
    <Row>
      <!-- 左边部门选择 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 4 }" class="tree-full-content">
        <BasicTree
          v-if="data.tree.length"
          :fieldNames="{ title: 'label', key: 'id' }"
          :tree-data="data.tree"
          :showLine="{ showLeafIcon: false }"
          search
          toolbar
          defaultExpandAll
          @select="handleSelectDept"
          v-model:selectedKeys="data.selectDeptId"
        />
        <!-- 仅本人数据权限 可以考虑直接不显示 -->
        <div class="mt-5" v-else>
          <Empty description="无部门数据" />
        </div>
      </Col>
      <!-- 右边表格及菜单 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 20 }">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <Space>
              <a-button
                type="primary"
                :pre-icon="IconEnum.ADD"
                @click="handleAdd"
                v-auth="'system:user:add'"
                >新增用户</a-button
              >
              <a-button
                :preIcon="IconEnum.DELETE"
                danger
                @click="multipleRemove(userRemove)"
                v-auth="'system:user:remove'"
                :disabled="!selected"
                >选中删除</a-button
              >
            </Space>
          </template>
          <template #toolbar>
            <Space>
              <a-button
                :preIcon="IconEnum.IMPORT"
                color="success"
                @click="handleImport"
                ghost
                v-auth="'system:user:import'"
                >导入数据</a-button
              >
              <a-button
                :preIcon="IconEnum.EXPORT"
                color="warning"
                @click="downloadExcel(userExport, '用户数据')"
                ghost
                v-auth="'system:user:export'"
                >导出数据</a-button
              >
            </Space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <TableSwitch
                v-model="record.status"
                :api="() => userStatusChange(record)"
                :custom-content="
                  (newStatusStr: string) => `确认${newStatusStr}用户[${record.userName}]吗?`
                "
                :reload="reload"
              />
            </template>
            <template v-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '修改',
                    icon: IconEnum.EDIT,
                    type: 'primary',
                    ghost: true,
                    auth: 'system:user:edit',
                    ifShow: () => record.userId !== 1,
                    onClick: handleEdit.bind(null, record),
                  },
                  {
                    label: '删除',
                    icon: IconEnum.DELETE,
                    type: 'error',
                    ghost: true,
                    auth: 'system:user:remove',
                    ifShow: () => record.userId !== 1,
                    popConfirm: {
                      placement: 'left',
                      title: `是否删除用户[${record.userName}]-${record.nickName}?`,
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
                :dropDownActions="[
                  {
                    label: '重置密码',
                    icon: IconEnum.RESET_PWD,
                    type: 'primary',
                    ghost: true,
                    auth: 'system:user:resetPwd',
                    ifShow: () => record.userId !== 1,
                    onClick: handleResetPassword.bind(null, record),
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </Col>
    </Row>
    <UserModal @register="registerModal" @reload="reloadWithCallback" />
    <UserResetPwdModal @register="registerPwdModal" @reload="reloadWithCallback" />
    <UserImportModal @register="registerImportModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col, Space, Empty } from 'ant-design-vue';
  import { BasicTree } from '/@/components/Tree/index';
  import {
    departmentTree,
    DeptTreeData,
    userList,
    userExport,
    userRemove,
  } from '/@/api/system/user';
  import { onMounted, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import UserModal from './UserModal.vue';
  import UserResetPwdModal from './UserResetPwdModal.vue';
  import UserImportModal from './UserImportModal.vue';
  import { useModal } from '/@/components/Modal';
  import { downloadExcel } from '@/utils/file/download';
  import { columns, schemas } from './user.data';
  import { IconEnum } from '@/enums/appEnum';
  import { TableSwitch } from '@/components/Table';
  import { userStatusChange } from '@/api/system/user';

  // 缓存
  defineOptions({ name: 'User' });

  type Data = {
    tree: DeptTreeData[];
    selectDeptId: string[];
  };
  const data: Data = reactive({
    tree: [],
    selectDeptId: [],
  });

  // 选中部门后刷新表格
  async function handleSelectDept() {
    await reload();
  }

  onMounted(async () => {
    data.tree = await departmentTree();
  });

  const [registerTable, { reload, selected, reloadWithCallback, multipleRemove }] = useTable({
    rowSelection: {
      type: 'checkbox',
      getCheckboxProps: (record: Recordable) => ({
        // 内置管理员不可选
        disabled: record.userId === 1,
      }),
    },
    showIndexColumn: false,
    api: userList,
    rowKey: 'userId',
    useSearchForm: true,
    formConfig: {
      schemas: schemas,
      baseColProps: {
        span: 8,
      },
      labelWidth: 80,
      resetFunc: async () => {
        data.selectDeptId = [];
        await reload();
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
    columns,
    // 需要添加上部门参数
    beforeFetch(params: Recordable) {
      if (data.selectDeptId.length === 1) {
        params.deptId = data.selectDeptId[0];
      }
      return params;
    },
    actionColumn: {
      width: 220,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerModal, { openModal }] = useModal();
  const [registerPwdModal, { openModal: openPwdModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();

  function handleImport() {
    openImportModal(true);
  }

  function handleResetPassword(record: Recordable) {
    const { userId } = record;
    openPwdModal(true, userId);
  }

  function handleEdit(record: Recordable) {
    openModal(true, { update: true, record });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await userRemove([record.userId]);
    await reload();
  }
</script>

<style lang="less" scoped>
  .tree-full-content {
    height: calc(100vh - 80px);
  }

  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
