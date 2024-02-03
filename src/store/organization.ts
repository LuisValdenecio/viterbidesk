import { create } from 'zustand';

export const organizationStore = create((set) => ({
  activeOrganizationId: '',
  setActiveOrg: (activeOrgId: string) =>
    set((state: any) => ({ activeOrganizationId: activeOrgId })),
}));
