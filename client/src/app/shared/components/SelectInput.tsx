import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { SelectProps } from "@mui/material";
type SelectInputProps = Partial<SelectProps>;

type Props<T extends FieldValues> = {
  items: { text: string; value: string }[];
  label: string;
} & UseControllerProps<T> &
  SelectInputProps;

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({ ...props });

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        label={props.label}
        value={field.value || ""}
        onChange={field.onChange}
      >
        {props.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
