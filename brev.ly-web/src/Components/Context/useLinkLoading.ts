import { useContext } from 'react';
import { LinkLoadingContext } from './LinkLoadingContext';

export const useLinkLoading = () => {
  const context = useContext(LinkLoadingContext);
  if (!context) {
    throw new Error('useLinkLoading deve ser usado dentro de LinkLoadingProvider');
  }
  return context;
};