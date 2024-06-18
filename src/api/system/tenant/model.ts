export interface Tenant {
  id: number;
  tenantId: string;
  contactUserName: string;
  contactPhone: string;
  companyName: string;
  licenseNumber?: any;
  address?: string;
  domain?: string;
  intro: string;
  remark?: string;
  packageId?: string;
  expireTime?: string;
  accountCount: number;
  status: string;
}
