<template>
  <div :class="[prefixCls, { fullscreen }]">
    <Upload
      name="file"
      multiple
      @change="handleChange"
      :action="fullUploadUrl"
      :headers="headers"
      :showUploadList="false"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >
      <a-button type="primary" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { Upload } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['uploading', 'done', 'error'],
    setup(props, { emit }) {
      let uploading = false;

      const { uploadUrl, apiUrl, urlPrefix, clientId } = useGlobSetting();
      const fullUploadUrl = urlPrefix
        ? `${apiUrl}${urlPrefix}${uploadUrl}`
        : `${apiUrl}${uploadUrl}`;
      // 这里是写死的 后期可能需要优化
      const headers = {
        Authorization: 'Bearer ' + getToken(),
        clientId,
      };

      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });

      const { createMessage } = useMessage();
      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        // const url = file?.response?.data.url;
        const name = file?.name;

        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          // http 200会走到这里  需要再次判断
          const { response } = file;
          const { code, msg = '服务器错误', data } = response;
          if (code === 200) {
            const { url } = data;
            emit('done', name, url);
          } else {
            createMessage.error(msg);
          }
          // emit('done', name, url);
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        prefixCls,
        handleChange,
        uploadUrl,
        fullUploadUrl,
        headers,
        t,
        getButtonProps,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
