<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
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
  import { ref, unref } from 'vue';
  import { websocketSend, websocketSendSomeone } from './api';

  const emit = defineEmits(['register', 'reload']);

  const isSendAll = ref<boolean>(true);

  const title = ref<string>('发送全体消息');

  interface Message {
    type: number;
    nickname?: string;
    sessionKey?: number;
  }

  // 0全体  1指定
  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (message: Message) => {
      const { type, nickname = '', sessionKey = 0 } = message;
      if (type === 1) {
        isSendAll.value = false;
        title.value = `发送给${nickname}的消息`;
        setFieldsValue({ sessionKey });
      } else {
        isSendAll.value = true;
        title.value = '发送全体消息';
      }
    },
  );

  const [registerForm, { resetForm, validate, setFieldsValue }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: [
      {
        field: 'msg',
        component: 'Input',
        label: '消息内容',
        required: true,
      },
      {
        field: 'sessionKey',
        component: 'Input',
        label: '消息内容',
        required: false,
        show: false,
      },
    ],
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isSendAll)) {
        await websocketSend(data.msg);
      } else {
        await websocketSendSomeone(data.sessionKey, data.msg);
      }
      await resetForm();
      emit('reload', closeModal);
    } catch (e) {
      console.log(e);
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
