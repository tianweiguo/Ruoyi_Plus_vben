<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="700"
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
  import { computed, ref } from 'vue';
  import { noticeUpdate, noticeAdd, noticeInfo } from '/@/api/system/notice';
  import { modalSchemas } from './notice.data';
  import { unref } from 'vue';

  defineOptions({ name: 'NoticeModal' });

  const emit = defineEmits(['register', 'reload']);

  const title = computed<string>(() => {
    return isUpdate.value ? '编辑公告' : '新增公告';
  });

  const isUpdate = ref<boolean>(false);
  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await noticeInfo(record.noticeId);
        await setFieldsValue(ret);
      }
    },
  );

  const [registerForm, { setFieldsValue, validate, resetForm }] = useForm({
    layout: 'vertical',
    labelWidth: 80,
    showActionButtonGroup: false,
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await noticeUpdate(data);
      } else {
        await noticeAdd(data);
      }
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
