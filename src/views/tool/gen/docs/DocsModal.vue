<template>
  <BasicModal v-bind="$attrs" title="如何使用代码生成" @register="registerModalInner" :width="600">
    <div class="text-xl">
      <p
        >1. 将项目下
        <span class="font-bold">src/views/tool/gen/vm/vben</span>
        文件夹复制到后端的
        <span class="font-bold">ruoyi-modules\ruoyi-generator的resources\vm</span> 下</p
      >
      <p
        >2. 替换 <span class="font-bold"> ruoyi-modules/ruoyi-generator</span>下的<span
          class="font-bold"
          >/util/VelocityUtils.java</span
        >(此文件只是新增了vben代码支持, 不影响原版plus-ui生成), 文件路径在上面的vm中</p
      >
      <p> 3. 下载后的vben文件夹即为生成的代码 </p>
    </div>

    <template #footer>
      <a-button @click="closeModal">关闭窗口</a-button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal } from '@/components/Modal';

  const [registerModalInner, { closeModal }] = useModalInner();
</script>

<style scoped></style>
