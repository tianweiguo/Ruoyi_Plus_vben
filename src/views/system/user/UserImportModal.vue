<template>
  <BasicModal
    v-bind="$attrs"
    title="导入用户数据"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="clearFileList"
  >
    <!-- 手动处理 而不是放入文件就上传 -->
    <UploadDragger
      v-model:fileList="fileList"
      :maxCount="1"
      :showUploadList="true"
      :beforeUpload="() => false"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">点击或者拖拽到此处上传文件</p>
    </UploadDragger>
    <Row>
      <Col :span="24">
        <span>允许导入xlsx, xls文件</span>
        <a-button type="link" link @click="downloadExcel(downloadImportTemplate, '用户导入模板')"
          >下载模板</a-button
        >
      </Col>
      <Col :span="24">
        是否更新/覆盖已存在的用户数据
        <Switch v-model:checked="checked" />
      </Col>
    </Row>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { downloadImportTemplate, userImportData } from '/@/api/system/user';
  import { Upload, Switch, Row, Col } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import { downloadExcel } from '/@/utils/file/download';
  import { UploadFile } from 'ant-design-vue/es/upload/interface';
  import { unref } from 'vue';

  // https://blog.csdn.net/weixin_35498622/article/details/126969884
  const UploadDragger = Upload.Dragger;

  defineOptions({ name: 'UserImportModal' });

  const emit = defineEmits(['register', 'reload']);

  const fileList = ref<UploadFile[]>([]);
  const checked = ref<boolean>(false);

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner();

  async function handleSubmit() {
    try {
      modalLoading(true);
      if (fileList.value.length !== 1) {
        closeModal();
        return;
      }
      const data = {
        updateSupport: unref(checked),
        file: unref(fileList)[0].originFileObj!,
      };
      await userImportData(data);
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      clearFileList();
      modalLoading(false);
    }
  }

  function clearFileList() {
    fileList.value = [];
  }
</script>

<style scoped></style>
