import { createContext } from 'react';

export type LinkLoadingContextType = {
  isCreatingLink: boolean;
  setIsCreatingLink: (value: boolean) => void;
};

export const LinkLoadingContext = createContext<LinkLoadingContextType | undefined>(undefined);