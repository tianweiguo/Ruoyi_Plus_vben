<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            type="primary"
            :pre-icon="IconEnum.ADD"
            @click="handleAdd"
            v-auth="'system:notice:add'"
            >新增公告</a-button
          >
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(noticeRemove)"
            :disabled="!selected"
            v-auth="'system:notice:remove'"
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
                label: '修改',
                icon: IconEnum.EDIT,
                type: 'primary',
                ghost: true,
                auth: 'system:notice:edit',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:notice:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除公告[${record.noticeTitle}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <NoticeModal @register="registerModal" @reload="reloadWithCallback" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { noticeList, noticeRemove } from '/@/api/system/notice';
  import { useModal } from '/@/components/Modal';
  import NoticeModal from './NoticeModal.vue';
  import { formSchems, columns } from './notice.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Notice' });

  const [registerTable, { reload, reloadWithCallback, multipleRemove, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showIndexColumn: true,
    api: noticeList,
    rowKey: 'noticeId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      labelWidth: 80,
      baseColProps: {
        span: 6,
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

  function handleEdit(record: Recordable) {
    openModal(true, { record, update: true });
  }

  function handleAdd() {
    openModal(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await noticeRemove([record.configId]);
    await reload();
  }
</script>

<style scoped></style>
