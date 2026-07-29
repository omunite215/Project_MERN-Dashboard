import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./http";
import type { Product } from "./types";
import type { ProductFormValues } from "@/validation/product";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductFormValues) => apiFetch<Product>("products", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ProductFormValues> }) =>
      apiFetch<Product>(`products/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ _id: string }>(`products/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
