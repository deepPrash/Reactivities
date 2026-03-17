import z from "zod";
import { requiredString } from "../util/util";

export const changePasswordSchema = z
  .object({
    currentPassword: requiredString("Current password is required"),
    newPassword: requiredString(
      "New password must be at least 8 characters long",
    ),
    confirmPassword: requiredString("Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm new password must match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
