import { toast } from '@/hooks/use-toast';

/**
 * Maps HTTP status codes and error types to user-friendly messages
 */
const getErrorMessage = (error: any): string => {
  // Check if it's an axios error
  const status = error.response?.status;
  const errorData = error.response?.data;
  const errorMessage = errorData?.message || errorData?.error || error.message;

  // Authentication errors (401)
  if (status === 401) {
    return 'Sesiunea ta a expirat. Te rugăm să te autentifici din nou.';
  }

  // Permission errors (403)
  if (status === 403) {
    return 'Nu ai permisiunea de a efectua această acțiune.';
  }

  // Not found errors (404)
  if (status === 404) {
    return 'Resursa solicitată nu a fost găsită.';
  }

  // Validation errors (400)
  if (status === 400) {
    // Check for specific validation messages
    if (errorMessage.toLowerCase().includes('email')) {
      return 'Adresa de email este invalidă sau deja folosită.';
    }
    if (errorMessage.toLowerCase().includes('password')) {
      return 'Parola nu îndeplinește cerințele (minim 6 caractere).';
    }
    if (errorMessage.toLowerCase().includes('file')) {
      return 'Fișierul este invalid sau prea mare. Verifică formatul și dimensiunea.';
    }
    if (errorMessage.toLowerCase().includes('limit')) {
      return 'Ai atins limita planului tău. Șterge resurse sau upgrade la un plan superior.';
    }
    return errorMessage || 'Datele introduse sunt invalide. Verifică informațiile.';
  }

  // Conflict errors (409)
  if (status === 409) {
    return 'Această resursă există deja. Încearcă un nume diferit.';
  }

  // Payload too large (413)
  if (status === 413) {
    return 'Fișierul este prea mare. Dimensiunea maximă acceptată este 10MB.';
  }

  // Rate limit errors (429)
  if (status === 429) {
    return 'Prea multe cereri. Te rugăm să încerci din nou în câteva momente.';
  }

  // Server errors (500+)
  if (status >= 500) {
    return 'Serverul întâmpină probleme. Te rugăm să încerci din nou mai târziu.';
  }

  // Network errors
  if (error.message === 'Network Error' || !error.response) {
    return 'Probleme de conexiune. Verifică conexiunea la internet.';
  }

  // Default fallback
  return 'A apărut o eroare. Te rugăm să încerci din nou.';
};

/**
 * Shows a user-friendly error toast and logs technical details to console
 */
export const showError = (error: any, customMessage?: string) => {
  // Get user-friendly message
  const userMessage = customMessage || getErrorMessage(error);

  // Log technical details to console for developers
  console.error('Error details:', {
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    data: error?.response?.data,
    message: error?.message,
    stack: error?.stack,
    fullError: error,
  });

  // Show user-friendly toast
  toast({
    variant: 'destructive',
    title: 'Eroare',
    description: userMessage,
  });
};

/**
 * Shows a success toast message
 */
export const showSuccess = (message: string, title: string = 'Succes') => {
  toast({
    variant: 'success',
    title,
    description: message,
  });
};

/**
 * Shows an info toast message
 */
export const showInfo = (message: string, title: string = 'Informație') => {
  toast({
    variant: 'default',
    title,
    description: message,
  });
};

/**
 * Wraps async operations with error handling
 */
export const withErrorHandling = async <T,>(
  operation: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
  }
): Promise<T | null> => {
  try {
    const result = await operation();
    
    if (options?.successMessage) {
      showSuccess(options.successMessage);
    }
    
    if (options?.onSuccess) {
      options.onSuccess(result);
    }
    
    return result;
  } catch (error) {
    showError(error, options?.errorMessage);
    
    if (options?.onError) {
      options.onError(error);
    }
    
    return null;
  }
};
