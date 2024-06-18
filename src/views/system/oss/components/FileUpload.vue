<template>
  <BasicUpload
    :preview="preview"
    :btnText="btnText"
    :maxSize="maxSize"
    :maxNumber="maxNumber"
    :accept="accept"
    @change="handleChange"
    :api="uploadApi"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { uploadApi } from '@/api/uoload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { propTypes } from '@/utils/propTypes';
  import { IconEnum } from '@/enums/appEnum';

  export default defineComponent({
    name: 'FileUpload',
    components: {
      BasicUpload,
    },
    props: {
      preview: propTypes.bool.def(false),
      btnText: propTypes.string.def('上传'),
      iconEnum: propTypes.string.def(IconEnum.UPLOAD),
      accept: propTypes.array.def([]),
      maxSize: propTypes.number.def(2),
      maxNumber: propTypes.number.def(10),
    },
    emits: ['reload'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      /**
       * 点击保存后的回调
       * @param list 链接list
       */
      function handleChange(list: string[]) {
        createMessage.success(`上传文件成功, 共上传${list.length}个`);
        emit('reload');
      }

      return {
        handleChange,
        uploadApi,
      };
    },
  });
</script>

<style scoped></style>
