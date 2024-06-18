<template>
  <BasicModal
    v-bind="$attrs"
    :minHeight="100"
    title="修改密码"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { userResetPassword } from '/@/api/system/user';
  import { resetPasswordSchemas } from './user.data';

  defineOptions({ name: 'UserResetPwdModal' });

  const emit = defineEmits(['register', 'reload']);

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (userId: string) => {
      await setFieldsValue({ userId });
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: resetPasswordSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      await userResetPassword(data);
      await resetForm();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
