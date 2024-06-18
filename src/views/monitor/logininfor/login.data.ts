import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';
import { getDictOptions } from '@/utils/dict';
import { DictEnum } from '/@/enums/dictEnum';
import { DescItem } from '@/components/Description';

const { renderDict, renderTooltip } = useRender();
export const columns: BasicColumn[] = [
  // {
  //   title: 'ID',
  //   dataIndex: 'infoId',
  // },
  {
    title: '用户账号',
    dataIndex: 'userName',
  },
  {
    title: 'IP地址',
    dataIndex: 'ipaddr',
  },
  {
    title: 'IP地点',
    dataIndex: 'loginLocation',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
  },
  {
    title: '系统',
    dataIndex: 'os',
  },
  {
    title: '登录结果',
    dataIndex: 'status',
    customRender({ value }) {
      return renderDict(value, DictEnum.COMMON_STATUS);
    },
  },
  {
    title: '信息',
    dataIndex: 'msg',
    ellipsis: true,
    customRender({ value }) {
      return renderTooltip(value);
    },
  },
  {
    title: '日期',
    dataIndex: 'loginTime',
  },
];

export const formSchems: FormSchema[] = [
  {
    field: 'ipaddr',
    label: 'IP地址',
    component: 'Input',
  },
  {
    field: 'userName',
    label: '用户账号',
    component: 'Input',
  },
  {
    field: 'status',
    label: '登录状态',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.COMMON_STATUS),
    },
  },
  {
    field: 'dateTime',
    label: '登录日期',
    component: 'RangePicker',
  },
];

const { renderBoldText } = useRender();
export const modalSchemas: DescItem[] = [
  {
    field: 'status',
    label: '登录状态',
    render(value) {
      return renderDict(value, DictEnum.COMMON_STATUS);
    },
  },
  {
    field: 'ipaddr',
    label: '账号信息',
    render(_, data) {
      const { userName, ipaddr, loginLocation } = data;
      return '账号: ' + userName + ' / ' + ipaddr + ' / ' + loginLocation;
    },
  },
  {
    field: 'loginTime',
    label: '登录时间',
  },
  {
    field: 'msg',
    label: '登录信息',
    render(_, data) {
      const { status, msg } = data;
      return renderBoldText(msg, status == '0' ? '' : 'text-red-500');
    },
  },
  {
    field: 'os',
    label: '登录设备',
  },
  {
    field: 'browser',
    label: '浏览器',
  },
];
