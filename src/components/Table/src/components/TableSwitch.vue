<template>
  <ASwitch
    v-bind="$attrs"
    :checked="modelValue"
    :checkedChildren="checkedText"
    :unCheckedChildren="unCheckedText"
    :checkedValue="checkedValue"
    :unCheckedValue="unCheckedValue"
    @change="onChange"
  />
</template>

<script lang="ts">
  import { Switch } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  import { propTypes } from '@/utils/propTypes';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'TableSwitch',
    components: {
      ASwitch: Switch,
    },
    inheritAttrs: false,
    props: {
      modelValue: propTypes
        .oneOfType([propTypes.bool, propTypes.string, propTypes.number])
        .def(false),
      checkedText: propTypes.string.def('启用'),
      unCheckedText: propTypes.string.def('禁用'),
      checkedValue: propTypes
        .oneOfType([propTypes.bool, propTypes.string, propTypes.number])
        .def('0'),
      unCheckedValue: propTypes
        .oneOfType([propTypes.bool, propTypes.string, propTypes.number])
        .def('1'),
      api: {
        type: Function,
        required: false,
      },
      reload: {
        type: Function,
        required: false,
      },
      customContent: {
        type: Function,
        required: false,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const { createConfirm } = useMessage();
      type CheckedType = boolean | string | number;
      function onChange(checked: CheckedType) {
        const { checkedValue, unCheckedValue, checkedText, unCheckedText } = props;
        // 原本的状态
        const lastStatus = checked === checkedValue ? unCheckedValue : checkedValue;
        // 当前状态提示
        const newStatusStr = checked === checkedValue ? checkedText : unCheckedText;
        // 切换状态
        emit('update:modelValue', checked);
        // 自定义内容
        const defaultContent = `确认${newStatusStr}吗?`;
        const { customContent } = props;
        const content = customContent ? customContent(newStatusStr) : defaultContent;
        createConfirm({
          title: '提示',
          iconType: 'warning',
          content: content,
          async onOk() {
            const { api, reload } = props;
            if (!api) return;
            try {
              await api();
              if (reload) {
                await reload();
              }
            } catch (e) {
              emit('update:modelValue', lastStatus);
            }
          },
          onCancel() {
            emit('update:modelValue', lastStatus);
          },
        });
      }

      return {
        onChange,
      };
    },
  });
</script>

<style scoped></style>
