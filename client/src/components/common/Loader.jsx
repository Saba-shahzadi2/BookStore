const Loader = ({ size = "md", text = "Loading...", fullScreen = false }) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const loaderSize = sizes[size] || sizes.md;
  const textSize = textSizes[size] || textSizes.md;

  return (
    <div
      className={
        fullScreen
          ? "flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4"
          : "flex min-h-[250px] items-center justify-center px-4 py-10"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Spinner */}
        <div
          className={`${loaderSize} animate-spin rounded-full border-slate-200 border-t-slate-900`}
          aria-hidden="true"
        />

        {/* Loading Text */}
        {text && (
          <p
            className={`mt-4 text-center font-medium text-slate-500 ${textSize}`}
          >
            {text}
          </p>
        )}

        {/* Screen-reader fallback */}
        <span className="sr-only">{text || "Loading, please wait."}</span>
      </div>
    </div>
  );
};

export default Loader;
