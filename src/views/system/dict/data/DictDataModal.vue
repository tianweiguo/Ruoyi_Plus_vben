<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
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
  import { dictDataAdd, dictDataUpdate, dictDetailInfo } from '/@/api/system/dict/dictData';
  import { unref } from 'vue';
  import { modalSchemas } from './dictData.data';

  defineOptions({ name: 'DictDataModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);

  const title = computed<string>(() => {
    return isUpdate.value ? '编辑字典数据' : '新增字典数据';
  });

  const currentDictType = ref<string>('');

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean; dictType: string }) => {
      const { record, update, dictType } = data;
      isUpdate.value = update;
      currentDictType.value = dictType;
      // 设置
      await setFieldsValue({ dictType });
      if (update && record) {
        const ret = await dictDetailInfo(record.dictCode);
        await setFieldsValue(ret);
      }
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await dictDataUpdate(data);
      } else {
        await dictDataAdd(data);
      }
      emit('reload', closeModal);
      await resetForm();
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
