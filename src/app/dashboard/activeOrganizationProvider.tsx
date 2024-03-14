'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchDefaultOrganization } from '@/lib/data';
import { getActiveOrgCookie, setActiveOrgCookie } from '../lib/actions';

export const OrganizationContext = createContext({});

export const OrganizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    const orgOwned = async () => {
      const org = await fetchDefaultOrganization();
      if (org) {
        setOrganizationId(org);
      }
    };

    orgOwned().catch((e) => {
      console.error('An error occured while fetching the data');
    });
  }, []);

  return (
    <OrganizationContext.Provider value={{ organizationId, setOrganizationId }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);
