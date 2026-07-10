import { useMutation, useQuery } from '@tanstack/react-query';
import * as authService from '../services/authService';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      authService.register(data.email, data.password, data.name),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getProfile(),
  });
}
