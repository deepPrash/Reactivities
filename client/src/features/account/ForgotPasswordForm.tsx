import { toast } from "react-toastify";
import { useAccount } from "../../lib/hooks/useAccount";
import { useNavigate } from "react-router";
import AccountFormWrapper from "./AccountFormWrapper";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { FieldValues } from "react-hook-form";

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAccount();
  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    await forgotPassword.mutateAsync(data.email, {
      onSuccess: () => {
        toast.success("Password reset email sent. Please check your inbox.");
        navigate("/login");
      },
    });
    try {
    } catch (error) {}
  };

  return (
    <AccountFormWrapper
      title="Please enter our email Id"
      icon={<LockOpen fontSize="large" />}
      submitButtonText="Request password reset link"
      onSubmit={onSubmit}
    >
      <TextInput rules={{ required: true }} label="Email" name="email" />
    </AccountFormWrapper>
  );
}
