'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export const PopoverGuideContext = createContext({});

export const PopoverGuideProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [guideIndex, setGuideIndex] = useState(0);

  return (
    <PopoverGuideContext.Provider value={{ guideIndex, setGuideIndex }}>
      {children}
    </PopoverGuideContext.Provider>
  );
};

export const useOrganization = () => useContext(PopoverGuideContext);
