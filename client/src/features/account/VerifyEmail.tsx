import { useEffect, useRef, useState } from "react";
import { useAccount } from "../../lib/hooks/useAccount";
import { Link, useSearchParams } from "react-router";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { EmailRounded } from "@mui/icons-material";

export default function VerifyEmail() {
  const { verifyEmail, resendConfirmationEmail } = useAccount();
  const [status, setStatus] = useState("verifying");
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  const hasRun = useRef(false);

  useEffect(() => {
    if (userId && code && !hasRun.current) {
      hasRun.current = true;
      verifyEmail
        .mutateAsync({ userId, code })
        .then(() => setStatus("verified"))
        .catch(() => setStatus("failed"));
    }
  }, [code, userId, verifyEmail]);

  const getBody = () => {
    switch (status) {
      case "verifying":
        return <Typography>Verifying...</Typography>;
      case "failed":
        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap={2}
          >
            <Typography variant="h5" color="error">
              Verification Failed. You can try resending the verification link
              to your email.
            </Typography>
            <Button
              onClick={() => resendConfirmationEmail.mutate({ userId })}
              disabled={resendConfirmationEmail.isPending}
            >
              Resend Verification Email
            </Button>
          </Box>
        );
      case "verified":
        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap={2}
          >
            <Typography variant="h5" color="error">
              Email has been verified. You can now login.
            </Typography>
            <Button component={Link} to={`/login`}>
              Go to Login
            </Button>
          </Box>
        );
    }
  };

  return (
    <Paper
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
      }}
    >
      <EmailRounded sx={{ fontsize: 100, color: "primary" }} />
      <Typography gutterBottom variant="h3">
        Email Verification
      </Typography>
      <Divider />
      {getBody()}
    </Paper>
  );
}
