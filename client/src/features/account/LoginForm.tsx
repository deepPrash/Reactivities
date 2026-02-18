import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { LockOpen } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";

export default function LoginForm() {
  const { loginUser } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data, {
      onSuccess: () => {
        navigate(location.state?.from || "/activities");
      },
    });
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        maxWidth: "md",
        borderRadius: 3,
        mx: "auto",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        color="secondary.main"
      >
        <LockOpen fontSize="large" />
        <Typography variant="h4">Sign in</Typography>
      </Box>
      <TextInput name="email" control={control} label="Email" />
      <TextInput
        name="password"
        control={control}
        label="Password"
        type="password"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isValid || isSubmitting}
        size="large"
      >
        Login
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Don't have an account?
        <Typography
          component={Link}
          to="/register"
          color="primary"
          sx={{ ml: 2 }}
        >
          Sign Up
        </Typography>
      </Typography>
    </Paper>
  );
}
