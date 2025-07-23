type Step = {
  id: number
  order: number
  description: string
}

type TestStepsProps = {
  steps: Step[]
  evaluation: string
}

export function TestSteps({ steps, evaluation }: TestStepsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Steps</h2>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
              {step.order}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-gray-700">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Success Criteria */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Success Criteria</h3>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{evaluation}</p>
        </div>
      </div>
    </div>
  )
}
