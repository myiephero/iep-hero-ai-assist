import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user");
      if (!response.ok) {
        return null; // Return null instead of throwing error
      }
      try {
        return response.json();
      } catch {
        return null; // Return null if JSON parsing fails
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // If we get a 401, treat it as not authenticated rather than loading
  const isAuthError = error && String(error).includes('401');
  const actuallyLoading = isLoading && !isAuthError;

  return {
    user,
    isLoading: actuallyLoading,
    isAuthenticated: !!user,
    authError: isAuthError,
  };
}
