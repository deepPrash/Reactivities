import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount";
import {
  registerSchema,
  RegisterSchema,
} from "../../lib/schemas/registerSchema";
import { useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { LockOpen } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { Link } from "react-router";
import { set } from "date-fns";

export default function RegisterForm() {
  const { registerUser } = useAccount();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    await registerUser.mutateAsync(data, {
      onError: (error) => {
        if (Array.isArray(error)) {
          error.forEach((err) => {
            if (err.includes("Email")) setError("email", { message: err });
            else if (err.includes("Password"))
              setError("password", { message: err });
          });
        }
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
        <Typography variant="h4">Register</Typography>
      </Box>
      <TextInput name="email" control={control} label="Email" />
      <TextInput name="displayName" control={control} label="Display Name" />
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
        Register
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        Already have an account?
        <Typography component={Link} to="/login" color="primary" sx={{ ml: 2 }}>
          Sign In
        </Typography>
      </Typography>
    </Paper>
  );
}
