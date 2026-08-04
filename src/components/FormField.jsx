// src/components/FormField.jsx
// Displays one labeled form input and its validation message.

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  ...inputProps
}) {
  const errorId = `${name}-error`;

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={error ? "input-error" : ""}
        {...inputProps}
      />

      {error && (
        <span
          id={errorId}
          role="alert"
          className="field-error"
        >
          {error}
        </span>
      )}
    </div>
  );
}