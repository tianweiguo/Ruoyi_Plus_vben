import { defineStore } from 'pinia';
import { tenantList } from '@/api/auth';
import { TenantOption } from '@/api/auth/model';
import { store } from '/@/store';

interface TenantState {
  tenantList: TenantOption[];
  tenantEnabled: boolean;
  checked: boolean;
}

export const useTenantStore = defineStore('tenant', {
  state: (): TenantState => ({
    tenantList: [],
    tenantEnabled: true,
    checked: false,
  }),
  actions: {
    async initTenant() {
      const { tenantEnabled, voList } = await tenantList();
      this.tenantEnabled = tenantEnabled;
      this.tenantList = voList;
    },
    setChecked(checked: boolean) {
      this.checked = checked;
    },
  },
});

export function useTenantStoreWithOut() {
  return useTenantStore(store);
}
