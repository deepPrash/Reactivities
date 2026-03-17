import z from "zod";
import { requiredString } from "../util/util";

export const resetPasswordSchema = z
  .object({
    newPassword: requiredString(
      "New password must be at least 8 characters long",
    ),
    confirmPassword: requiredString("Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
