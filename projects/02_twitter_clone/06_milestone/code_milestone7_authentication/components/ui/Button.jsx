export default function Button({ 
  children, 
  variant = "primary", 
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  const baseStyles = "px-4 py-2 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
