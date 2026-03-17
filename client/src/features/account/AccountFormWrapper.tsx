import { Box, Button, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import { FieldValues, FormProvider, Resolver, useForm } from "react-hook-form";

type Props<TFormData extends FieldValues> = {
  title: string;
  icon: ReactNode;
  onSubmit: (data: TFormData) => Promise<void>;
  children: ReactNode;
  submitButtonText: string;
  resolver?: Resolver<TFormData>;
  reset?: boolean;
};

export default function AccountFormWrapper<TFormData extends FieldValues>({
  title,
  icon,
  onSubmit,
  children,
  submitButtonText,
  resolver,
  reset,
}: Props<TFormData>) {
  const methods = useForm<TFormData>({ resolver, mode: "onTouched" });

  const formSubmit = async (data: TFormData) => {
    await onSubmit(data);
    if (reset) {
      methods.reset();
    }
  };
  return (
    <FormProvider {...methods}>
      <Paper
        component="form"
        onSubmit={methods.handleSubmit(formSubmit)}
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
          {icon}
          <Typography variant="h4">{title}</Typography>
        </Box>
        {children}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !methods.formState.isValid || methods.formState.isSubmitting
          }
          size="large"
        >
          {submitButtonText}
        </Button>
      </Paper>
    </FormProvider>
  );
}
