<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <a-button
            :pre-icon="IconEnum.DELETE"
            danger
            :disabled="!selected"
            @click="multipleRemove(operLogDelete)"
            v-auth="'monitor:operlog:remove'"
            >删除所选项</a-button
          >
          <a-button
            :pre-icon="IconEnum.DELETE"
            @click="handleDeleteAll"
            v-auth="'monitor:operlog:remove'"
            >清空全部日志</a-button
          >
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button
            :preIcon="IconEnum.EXPORT"
            color="warning"
            ghost
            v-auth="'monitor:operlog:export'"
            @click="downloadExcel(operLogExport, '操作日志')"
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
                label: '查看详情',
                icon: IconEnum.DETAIL,
                type: 'primary',
                ghost: true,
                onClick: handleCheck.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <InfoModal @register="registerModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { operLogList, operLogExport, operLogDelete, operLogClean } from '/@/api/monitor/operlog';
  import InfoModal from './InfoModal.vue';
  import { useModal } from '/@/components/Modal';
  import { Space } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadExcel } from '@/utils/file/download';
  import { formSchems, columns } from './operlog.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'Operlog' });

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { multipleRemove, reload, selected }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showIndexColumn: false,
    api: operLogList,
    rowKey: 'operId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      labelWidth: 80,
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
      width: 160,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  function handleCheck(record: any) {
    openModal(true, record);
  }

  const { createConfirm } = useMessage();

  function handleDeleteAll() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '是否要清空全部日志内容?',
      onOk: async () => {
        await operLogClean();
        await reload();
      },
    });
  }
</script>

<style scoped></style>
