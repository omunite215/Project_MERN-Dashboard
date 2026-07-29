import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useCreateProduct, useUpdateProduct } from "@/api/products";
import { productFormSchema } from "@/validation/product";
import { toMsg } from "@/utils/formError";
import type { Product } from "@/api/types";

interface Props {
  open: boolean;
  initial?: Product;
  onClose: () => void;
}

export default function ProductForm({ open, initial, onClose }: Props) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const isPending = createProduct.isPending || updateProduct.isPending;

  const form = useForm({
    defaultValues: {
      name: initial?.name ?? "",
      price: initial?.price ?? 0,
      description: initial?.description ?? "",
      category: initial?.category ?? "",
      rating: initial?.rating ?? 0,
      supply: initial?.supply ?? 0,
    },
    onSubmit: async ({ value }) => {
      setMutationError(null);
      try {
        if (initial) {
          await updateProduct.mutateAsync({ id: initial._id, body: value });
        } else {
          await createProduct.mutateAsync(value);
        }
        onClose();
      } catch (err) {
        setMutationError(
          err instanceof Error ? err.message : "An error occurred"
        );
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? "Edit Product" : "Create Product"}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {mutationError}
            </Alert>
          )}

          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.name.safeParse(value).success
                  ? undefined
                  : "Name is required (max 200 chars)",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  label="Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>

          <form.Field
            name="price"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.price.safeParse(value).success
                  ? undefined
                  : "Price must be ≥ 0",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.description.safeParse(value).success
                  ? undefined
                  : "Description is required",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>

          <form.Field
            name="category"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.category.safeParse(value).success
                  ? undefined
                  : "Category is required",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  label="Category"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>

          <form.Field
            name="rating"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.rating.safeParse(value).success
                  ? undefined
                  : "Rating must be 0–5",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, max: 5, step: 0.1 } }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>

          <form.Field
            name="supply"
            validators={{
              onChange: ({ value }) =>
                productFormSchema.shape.supply.safeParse(value).success
                  ? undefined
                  : "Supply must be a non-negative integer",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  label="Supply"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                  error={hasError}
                  helperText={
                    hasError ? toMsg(field.state.meta.errors[0]) : undefined
                  }
                />
              );
            }}
          </form.Field>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Saving…" : initial ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
