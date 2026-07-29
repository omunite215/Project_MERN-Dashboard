import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useRegister } from "@/api/auth";
import { registerSchema } from "@/validation/auth";

/** Coerce a field error value to a display string (v1 errors may be unknown). */
function toMsg(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof (e as { message?: unknown }).message === "string")
    return (e as { message: string }).message;
  return String(e);
}

export default function Register() {
  const navigate = useNavigate();
  const register = useRegister();

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      await register.mutateAsync(value);
      void navigate({ to: "/dashboard" as "/" });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create account
        </Typography>

        {register.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(register.error as Error).message}
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.name.safeParse(value).success
                  ? undefined
                  : "Name must be 2–100 characters",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  autoComplete="name"
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
            name="email"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.email.safeParse(value).success
                  ? undefined
                  : "Invalid email",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  autoComplete="email"
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
            name="password"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.password.safeParse(value).success
                  ? undefined
                  : "Password must be 8–128 characters",
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              return (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={register.isPending}
          >
            {register.isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <Typography sx={{ mt: 2 }} variant="body2">
          Already have an account?{" "}
          <Link to={"/login" as "/"}>Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
