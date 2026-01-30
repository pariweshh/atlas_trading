import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import type { Alert, CreateAlertInput } from "@/types"

export function useAlerts(status?: "active" | "all") {
  return useQuery({
    queryKey: ["alerts", status],
    queryFn: async () => {
      const params = status ? { status } : {}
      const response = await api.get<Alert[]>("/alerts", { params })
      return response.data
    },
  })
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ["alert", id],
    queryFn: async () => {
      const response = await api.get<Alert>(`/alerts/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAlertInput) => {
      const response = await api.post<Alert>("/alerts", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert created successfully")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Failed to create alert")
    },
  })
}

export function useUpdateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateAlertInput>
    }) => {
      const response = await api.put<Alert>(`/alerts/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert updated successfully")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Failed to update alert")
    },
  })
}

export function useDeleteAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/alerts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert deleted")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Failed to delete alert")
    },
  })
}

export function useCancelAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<Alert>(`/alerts/${id}/cancel`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert cancelled")
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      toast.error(error.response?.data?.message || "Failed to cancel alert")
    },
  })
}
