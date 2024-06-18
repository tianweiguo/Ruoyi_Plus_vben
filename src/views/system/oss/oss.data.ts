import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';

const { renderTooltip } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    ellipsis: true,
    customRender({ value }) {
      return renderTooltip(value);
    },
  },
  {
    title: '文件原名',
    dataIndex: 'originalName',
    ellipsis: true,
    customRender({ value }) {
      return renderTooltip(value);
    },
  },
  {
    title: '文件拓展名',
    dataIndex: 'fileSuffix',
  },
  {
    title: '文件预览',
    dataIndex: 'url',
    ellipsis: true,
    customRender({ value }) {
      return renderTooltip(value);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
  },
  {
    title: '上传人',
    dataIndex: 'createByName',
  },
  {
    title: '服务商',
    dataIndex: 'service',
  },
];

export const formSchems: FormSchema[] = [
  {
    label: '文件名',
    field: 'fileName',
    component: 'Input',
  },
  {
    label: '原名',
    field: 'originalName',
    component: 'Input',
  },
  {
    label: '拓展名',
    field: 'fileSuffix',
    component: 'Input',
  },
  {
    label: '服务商',
    field: 'service',
    component: 'Input',
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
  },
];
