import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount";
import { loginSchema, LoginSchema } from "../../lib/schemas/loginSchema";
import { useForm, useWatch } from "react-hook-form";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { LockOpen } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [notVerified, setNotVerified] = useState(false);
  const { loginUser, resendConfirmationEmail } = useAccount();
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

  const email = useWatch({ control, name: "email" });

  const handleResendEmail = async () => {
    try {
      await resendConfirmationEmail.mutateAsync({ email });
      setNotVerified(false);
    } catch (error) {
      console.log(error);
      toast.error("Problem sending email - please check email address");
    }
  };

  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data, {
      onSuccess: () => {
        navigate(location.state?.from || "/activities");
      },
      onError: (error) => {
        if (error.message === "NotAllowed") {
          setNotVerified(true);
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
      {notVerified ? (
        <Box display=" flex" flexDirection="column" justifyContent="center">
          <Typography textAlign="center" color="error">
            Your email has not been verified. You can click the button below to
            resend the verification email.
          </Typography>
          <Button
            disabled={resendConfirmationEmail.isPending}
            onClick={handleResendEmail}
          >
            Resend email link
          </Button>
        </Box>
      ) : (
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
      )}
    </Paper>
  );
}
