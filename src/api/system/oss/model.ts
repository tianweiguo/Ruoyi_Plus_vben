export interface OssFile {
  ossId: string;
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  createTime: string;
  createBy: number;
  createByName: string;
  service: string;
}

export interface OssConfig {
  ossConfigId: number;
  configKey: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  prefix: string;
  endpoint: string;
  domain: string;
  isHttps: string;
  region: string;
  status: string;
  ext1: string;
  remark: string;
  accessPolicy: string;
}
