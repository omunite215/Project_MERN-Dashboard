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
import { useLogin } from "@/api/auth";
import { loginSchema } from "@/validation/auth";

/** Coerce a field error value to a display string (v1 errors may be unknown). */
function toMsg(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof (e as { message?: unknown }).message === "string")
    return (e as { message: string }).message;
  return String(e);
}

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value);
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
          Sign in
        </Typography>

        {login.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(login.error as Error).message}
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                loginSchema.shape.email.safeParse(value).success
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
                loginSchema.shape.password.safeParse(value).success
                  ? undefined
                  : "Password is required",
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
                  autoComplete="current-password"
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
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Typography sx={{ mt: 2 }} variant="body2">
          No account?{" "}
          <Link to={"/register" as "/"}>Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
