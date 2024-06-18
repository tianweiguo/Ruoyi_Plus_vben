export interface ListItem {
  id: string;
  avatar: string;
  // 通知的标题内容
  title: string;
  // 是否在标题上显示删除线
  titleDelete?: boolean;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra?: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  unreadlist?: ListItem[];
}

export const tabListData: TabItem[] = [
  {
    key: '1',
    name: '通知',
    list: [
      // {
      //   id: '000000005',
      //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
      //   title:
      //     '标题可以设置自动显示省略号，本例中标题行数已设为1行，如果内容超过1行将自动截断并支持tooltip显示完整标题。',
      //   description: '',
      //   datetime: '2017-08-07',
      //   type: '1',
      // },
    ],
  },
  {
    key: '2',
    name: '消息',
    list: [
      // {
      //   id: '000000008',
      //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      //   title: '标题',
      //   description:
      //     '请将鼠标移动到此处，以便测试超长的消息在此处将如何处理。本例中设置的描述最大行数为2，超过2行的描述内容将被省略并且可以通过tooltip查看完整内容',
      //   datetime: '2017-08-07',
      //   type: '2',
      //   clickClose: true,
      // },
    ],
  },
  {
    key: '3',
    name: '待办',
    list: [
      // {
      //   id: '000000009',
      //   avatar: '',
      //   title: '任务名称',
      //   description: '任务需要在 2017-01-12 20:00 前启动',
      //   datetime: '',
      //   extra: '未开始',
      //   color: '',
      //   type: '3',
      // },
    ],
  },
];
