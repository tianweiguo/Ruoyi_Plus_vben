<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
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
  import { computed, ref, unref } from 'vue';
  import { clientAdd, clientUpdate, clientInfo } from '/@/api/system/client';
  import { modalSchemas } from './client.data';

  defineOptions({ name: 'ClientModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);

  const title = computed<string>(() => {
    return isUpdate.value ? '编辑客户端管理' : '新增客户端管理';
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      const { record, update } = data;
      isUpdate.value = update;

      updateSchema([
        { field: 'clientId', show: update },
        { field: 'clientKey', componentProps: { disabled: update } },
        { field: 'clientSecret', componentProps: { disabled: update } },
      ]);

      if (update && record) {
        const ret = await clientInfo(record.id);
        await setFieldsValue(ret);
      }
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    layout: 'vertical',
    labelWidth: 180,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      data.grantType = data.grantTypeList.join(',');
      if (unref(isUpdate)) {
        await clientUpdate(data);
      } else {
        await clientAdd(data);
      }
      await resetForm();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
