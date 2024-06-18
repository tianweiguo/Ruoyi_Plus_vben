export enum DictEnum {
  NORMAL_DISABLE = 'sys_normal_disable',
  COMMON_STATUS = 'sys_common_status',
  JOB_GROUP = 'sys_job_group', // 定时任务分组
  JOB_STATUS = 'sys_job_status', // 任务状态
  YES_NO = 'sys_yes_no', // 是否
  SYS_USER_SEX = 'sys_user_sex', // 性别
  SHOW_HIDE = 'sys_show_hide', // 显示状态
  NOTICE_TYPE = 'sys_notice_type', // 通知类型
  NOTICE_STATUS = 'sys_notice_status', // 通知状态
  OSS_ACCESS_POLICY = 'oss_access_policy', // oss权限桶类型
  SYS_OPER_TYPE = 'sys_oper_type', // 操作类型
  SYS_DEVICE_TYPE = 'sys_device_type', // 设备类型
  SYS_GRANT_TYPE = 'sys_grant_type', // 授权类型
}

// 提供给下拉框使用
export const fieldNames = { label: 'dictLabel', value: 'dictValue' };
