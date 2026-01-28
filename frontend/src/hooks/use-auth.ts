import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types"

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>("/auth/login", credentials)
      return response.data
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      toast.success("Welcome back!")
      router.push("/dashboard")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Invalid credentials")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials,
      )
      return response.data
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken)
      toast.success("Account created successfully!")
      router.push("/dashboard")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Registration failed")
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout")
    },
    onSuccess: () => {
      logout()
      toast.success("Logged out successfully")
      router.push("/login")
    },
    onError: () => {
      logout()
      router.push("/login")
    },
  })
}
