<template>
  <Tag v-if="color" :color="color">{{ label }}</Tag>
  <span v-if="!color">{{ label }}</span>
</template>

<script setup lang="ts">
  import { Tag } from 'ant-design-vue';
  import { computed } from 'vue';
  import { DictData } from '/@/api/system/dict/dictData.model';
  import { tagTypes } from './data';

  defineOptions({ name: 'DictTag' });

  type DictTagProps = {
    dicts: DictData[]; // dict数组
    value: string | number; // value
  };
  const props = withDefaults(defineProps<DictTagProps>(), {
    dicts: undefined,
  });

  /**
   * 是否为16进制颜色
   * @param color 颜色
   */
  function isHexColor(color: string) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color);
  }

  const color = computed<string>(() => {
    const current = props.dicts.filter((item) => item.dictValue == props.value)[0];
    // cssClass在element-plus中是作为css类名使用  在这里是作为16进制颜色使用
    const cssClass = current?.cssClass;
    // listClass是tag组件的color使用 优先级应该低于自定义颜色
    const listClass = current?.listClass;
    // 都不存在的话返回空颜色
    if (!listClass && !cssClass) {
      return '';
    }
    // 优先返回自定义颜色
    // update 2023-12-21 由于官方使用这个是作为css类名 这里用作自定义颜色  需要判断
    // 是16进制颜色  直接返回
    if (isHexColor(cssClass)) {
      return cssClass;
    }
    // 这里做了antd - element-plus的兼容
    return tagTypes[listClass].color;
  });

  const label = computed<string | number>(() => {
    const current = props.dicts.filter((item) => item.dictValue == props.value)[0];
    return current?.dictLabel ?? 'unknown';
  });
</script>

<style scoped></style>
