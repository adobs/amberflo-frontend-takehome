import { ReactNode, createContext, useContext } from 'react';
import { useToast, UseToastOptions } from '@chakra-ui/react';

const ToastContext = createContext(null);

// expose the context so we can use it as a hook
export const useCustomToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();

  function showToast(title: string, status: UseToastOptions['status']) {
    toast({
      title,
      isClosable: true,
      status,
      variant: 'left-accent',
    });
  }

  return (
    <ToastContext.Provider
      value={{
        showToast: (title, status) => showToast(title, status),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
