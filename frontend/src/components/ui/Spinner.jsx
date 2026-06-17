export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`inline-block ${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin ${className}`} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
