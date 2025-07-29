import { useState } from 'react';
import { LinkLoadingContext } from './LinkLoadingContext';

export const LinkLoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  return (
    <LinkLoadingContext.Provider value={{ isCreatingLink, setIsCreatingLink }}>
      {children}
    </LinkLoadingContext.Provider>
  );
};