import { useState, useEffect, useCallback } from 'react';

// Tipos genéricos para o hook
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Hook genérico para chamadas de API
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = false, onSuccess, onError } = options;

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction(...args);
      setState({ data, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      setState({ data: null, loading: false, error: errorMessage });
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  // Executar imediatamente se solicitado
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook para dados paginados
export function usePaginatedApi<T = any>(
  apiFunction: (page: number, size: number, ...args: any[]) => Promise<{
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }>,
  initialPage: number = 0,
  initialSize: number = 10,
  options: UseApiOptions = {}
) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const { loading, error, execute } = useApi(
    (pageNum: number, pageSize: number, ...args: any[]) => 
      apiFunction(pageNum, pageSize, ...args),
    options
  );

  const fetchData = useCallback(async (...args: any[]) => {
    try {
      const result = await execute(page, size, ...args);
      
      setAllData(result.content);
      setPagination({
        totalElements: result.totalElements,
        totalPages: result.totalPages,
        first: result.first,
        last: result.last,
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [execute, page, size]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset para primeira página
  }, []);

  const nextPage = useCallback(() => {
    if (!pagination.last) {
      setPage(prev => prev + 1);
    }
  }, [pagination.last]);

  const prevPage = useCallback(() => {
    if (!pagination.first) {
      setPage(prev => prev - 1);
    }
  }, [pagination.first]);

  // Executar quando página ou tamanho mudarem
  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [page, size, fetchData, options.immediate]);

  return {
    data: allData,
    loading,
    error,
    pagination: {
      ...pagination,
      currentPage: page,
      pageSize: size,
    },
    fetchData,
    goToPage,
    changeSize,
    nextPage,
    prevPage,
    setPage,
    setSize,
  };
}

// Hook para formulários com validação
export function useForm<T = Record<string, any>>(
  initialValues: T,
  validationSchema?: any
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o campo for alterado
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validateField = useCallback((field: keyof T, value: any) => {
    if (!validationSchema) return true;
    
    try {
      const fieldSchema = validationSchema.fields?.[field];
      if (fieldSchema) {
        fieldSchema.validateSync(value);
      }
      return true;
    } catch (error: any) {
      setFieldError(field, error.message);
      return false;
    }
  }, [validationSchema, setFieldError]);

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm,
    reset,
    setValues,
    setErrors,
    setTouched,
  };
}

// Hook para debounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover do localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

export default useApi;
