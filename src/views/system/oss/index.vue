<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <Space>
          <FileUpload v-bind="fileAttrs" @reload="reload" />
          <FileUpload v-bind="imageAttrs" @reload="reload" />
          <a-button
            :preIcon="IconEnum.DELETE"
            danger
            @click="multipleRemove(ossRemove)"
            :disabled="!selected"
            v-auth="'system:oss:remove'"
            >选中删除</a-button
          >
          预览图片:
          <Switch v-model:checked="preview" />
        </Space>
      </template>
      <template #toolbar>
        <Space>
          <a-button preIcon="icon-park-outline:setting" type="primary" @click="handleToSettings"
            >OSS配置管理</a-button
          >
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <TableImg
            v-if="preview && isImageFile(record.url)"
            :imgList="[record.url]"
            :size="50"
            simpleShow
          />
          <Tooltip v-else :title="record.url">{{ record.url }}</Tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '下载',
                icon: IconEnum.DOWNLOAD,
                type: 'primary',
                ghost: true,
                auth: 'system:oss:download',
                onClick: handleDownload.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'error',
                ghost: true,
                auth: 'system:oss:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除文件[${record.fileName}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction, TableImg } from '/@/components/Table';
  import { Space, Switch, Tooltip } from 'ant-design-vue';
  import { useLoading } from '/@/utils/components/loading';
  import { onMounted, ref, reactive } from 'vue';
  import { ossList, ossRemove, ossDownload } from '/@/api/system/oss';
  import { configInfoByKey } from '/@/api/system/config';
  import { useGo } from '/@/hooks/web/usePage';
  import { downloadByData } from '/@/utils/file/download';
  import { IconEnum } from '@/enums/appEnum';
  import { formSchems, columns } from './oss.data';
  import FileUpload from './components/FileUpload.vue';
  import { MimeType } from '@/enums/mimeType';

  defineOptions({ name: 'Oss' });

  const preview = ref<boolean>(false);

  const imageAttrs = reactive({
    btnText: '上传图片',
    accept: ['image/*'],
    maxSize: 5,
  });

  const { txt, doc, docx, xls, xlsx, ppt, pptx, pdf, mp3 } = MimeType;
  const fileAttrs = reactive({
    btnText: '上传文件',
    accept: [txt, doc, docx, xls, xlsx, ppt, pptx, pdf, mp3],
    maxSize: 10,
  });

  function isImageFile(ext: string) {
    const supportList = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    return supportList.some((item) => ext.includes(item));
  }

  onMounted(async () => {
    const ret = await configInfoByKey('sys.oss.previewListResource');
    preview.value = Boolean(ret);
  });

  const [registerTable, { reload, selected, multipleRemove }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showIndexColumn: false,
    api: ossList,
    rowKey: 'ossId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchems,
      baseColProps: {
        span: 8,
      },
      // 日期选择格式化
      fieldMapToTime: [
        // 'YYYY-MM-DD'为时间格式，参考moment
        [
          'createTime',
          ['params[beginCreateTime]', 'params[endCreateTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns: columns,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [openLoading, closeLoading] = useLoading('下载文件中...');
  async function handleDownload(record: Recordable) {
    try {
      openLoading();
      const data = await ossDownload(record.ossId);
      downloadByData(data, record.originalName);
    } finally {
      closeLoading();
    }
  }

  async function handleDelete(record: Recordable) {
    await ossRemove([record.ossId]);
    await reload();
  }

  const go = useGo();
  function handleToSettings() {
    go('/oss-config/index');
  }
</script>

<style scoped></style>
./oss.config.data
