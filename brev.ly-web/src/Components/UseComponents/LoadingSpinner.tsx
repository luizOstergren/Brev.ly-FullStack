type SpinnerSize = 'sm' | 'md' | 'lg';

export const LoadingSpinner = ({ size = 'md' }: { size?: SpinnerSize }) => {
  const sizes: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: <explanation>
<div
      className={`animate-spin rounded-full border-2 border-current text-gray-400 border-t-transparent ${sizes[size]}`}
      role="status"
    >
    </div>
  );
};