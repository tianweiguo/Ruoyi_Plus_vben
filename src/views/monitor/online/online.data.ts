import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';

const { renderIconSpan, renderDateTime } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '会话ID',
    dataIndex: 'tokenId',
  },
  {
    title: '登录账号',
    dataIndex: 'userName',
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
  },
  {
    title: 'IP地址',
    dataIndex: 'ipaddr',
  },
  {
    title: '登录地址',
    dataIndex: 'loginLocation',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    customRender({ value }) {
      return renderIconSpan('entypo:browser', value, '5px');
    },
  },
  {
    title: '系统',
    dataIndex: 'os',
    customRender({ value }) {
      return renderIconSpan('streamline:computer-logo-windows-1-os-system-microsoft', value, '5px');
    },
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    customRender({ value }) {
      return renderDateTime(value);
    },
  },
];

export const formSchems: FormSchema[] = [
  {
    label: 'IP地址',
    field: 'ipaddr',
    component: 'Input',
  },
  {
    label: '用户账号',
    field: 'userName',
    component: 'Input',
  },
];
