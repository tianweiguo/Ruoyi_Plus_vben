<template>
  <a-row :gutter="[24, 15]" class="pr-2 pb-3">
    <a-col :xs="24" :sm="24" :md="12" :lg="12">
      <ACard>
        <div class="change-avatar">
          <a-row :gutter="[0, 20]">
            <a-col :span="24" style="display: flex; justify-content: center">
              <Tooltip title="点击上传头像">
                <CropperAvatar
                  :uploadApi="userUpdateAvatar"
                  :value="avatar"
                  :showBtn="false"
                  @change="updateUserInfo"
                  width="150"
                />
              </Tooltip>
            </a-col>
            <a-col :span="24">
              <Description @register="registerDescription" />
            </a-col>
          </a-row>
        </div>
      </ACard>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12">
      <ACard style="height: calc(100vh - 465px)">
        <BasicForm @register="register" />
        <div class="btn-submit">
          <a-button
            ghost
            type="primary"
            pre-icon="icon-park-outline:update-rotation"
            @click="handleSubmit"
          >
            更新基本信息
          </a-button>
        </div>
      </ACard>
    </a-col>
  </a-row>
</template>
<script lang="ts">
  import { Row, Col, Card, Tooltip } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CropperAvatar } from '/@/components/Cropper';
  import { Description, useDescription } from '/@/components/Description';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLoading } from '@/utils/components/loading';
  import { useUserStore } from '/@/store/modules/user';
  import { descSchemas, baseSetschemas } from './setting.data';
  import { userProfile, userProfileUpdate, userUpdateAvatar } from '@/api/system/profile';

  export default defineComponent({
    components: {
      BasicForm,
      ARow: Row,
      ACol: Col,
      ACard: Card,
      CropperAvatar,
      Tooltip,
      Description,
    },
    setup() {
      const { createConfirm } = useMessage();
      const userStore = useUserStore();

      const [register, { setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });

      const [registerDescription, { setDescProps }] = useDescription({
        schema: descSchemas,
        column: 1,
      });

      async function initUserProfile() {
        // postGroup, roleGroup,
        const { user, postGroup, roleGroup } = await userProfile();
        const currentUser = { ...user, postGroup, roleGroup };
        setDescProps({ data: currentUser });
        await setFieldsValue(user);
      }

      onMounted(async () => {
        initUserProfile();
      });

      const avatar = computed(() => {
        const { avatar } = userStore.getUserInfo;
        return avatar;
      });

      async function updateUserInfo() {
        // 上传完成后直接获取一次
        userStore.getUserInfoAction();
        await initUserProfile();
      }

      const [openLoading, closeLoading] = useLoading();
      function handleSubmit() {
        try {
          openLoading();
          createConfirm({
            title: '提示',
            iconType: 'info',
            content: '是否更新个人基本信息',
            onOk: async () => {
              const data = await validate();
              await userProfileUpdate(data);
              await updateUserInfo();
            },
          });
        } catch (e) {
        } finally {
          closeLoading();
        }
      }

      return {
        avatar,
        register,
        updateUserInfo,
        userUpdateAvatar,
        handleSubmit,
        registerDescription,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }

  :deep(.ant-card-body) {
    padding: 10px;
  }

  .btn-submit {
    margin-left: 100px;
  }
</style>
