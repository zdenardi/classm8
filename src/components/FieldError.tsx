import classNames from "classnames";

interface FieldErrorProps {
  message: string;
  cyTag?: string;
  className?: string;
}

/** Sub-component of FormLabel
 *  Integrates with React Hook Form ErrorMessage component to automatically render
 *  based on the whether theres is a error for the component's name */
const FieldError = (props: FieldErrorProps) => {
  const { message, cyTag, className } = props;
  return (
    <div className={classNames("flex items-top", className)} data-cy={cyTag}>
      <span className="ml-1 body-text-sb text-error text-left">*</span>
      <p className="body-text-sb text-error text-left">{message}</p>
    </div>
  );
};

export default FieldError;
