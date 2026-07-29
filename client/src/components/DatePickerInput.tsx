import { forwardRef } from "react";
import { TextField } from "@mui/material";

interface DatePickerInputProps {
  value?: string;
  label?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * MUI-themed input for react-datepicker's `customInput`, so the Daily page's
 * date pickers match the dashboard theme instead of rendering bare inputs.
 * react-datepicker injects `value`/`onClick`/`onChange` and expects a ref.
 */
const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ value, label, onClick, onChange }, ref) => (
    <TextField
      inputRef={ref}
      value={value ?? ""}
      label={label}
      onClick={onClick}
      onChange={onChange}
      size="small"
      variant="outlined"
      sx={{ width: "10rem" }}
    />
  )
);

DatePickerInput.displayName = "DatePickerInput";

export default DatePickerInput;
