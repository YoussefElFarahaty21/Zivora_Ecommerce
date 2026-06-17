const STEPS = [
  { label: 'Shipping Info', icon: '📦' },
  { label: 'Order Review', icon: '📋' },
  { label: 'Confirmed', icon: '✅' },
];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  index < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`mt-1.5 text-xs font-medium hidden sm:block ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 mb-4 sm:mb-0 transition-colors ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
