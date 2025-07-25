'use client'

import { Check, Trash2 } from 'lucide-react'
import { Fragment, useMemo, useReducer } from 'react'

import { saveTest } from '@/app/suite/[suiteId]/test/[testId]/edit/actions'
import type { TTest } from '@/app/suite/[suiteId]/test/[testId]/edit/loader'

import { PageHeader } from '../shared/PageHeader'
import { SectionHeader } from '../shared/SectionHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

type Step =
  | {
      status: 'new'

      id: string
      order: number
      description: string
    }
  | {
      status: 'existing'

      sourceId: number

      id: string
      order: number
      description: string

      deleted: boolean
    }

export type State = {
  label: string
  evaluation: string

  nextStepId: number

  steps: Step[]
}

function getInitialState(test: TTest): State {
  const steps: Step[] = test.steps.map((step) => ({
    status: 'existing',
    sourceId: step.id,
    id: `existing:${step.id}`,
    order: step.order,
    description: step.description,
    deleted: false,
  }))

  if (steps.length === 0) {
    steps.push({ status: 'new', id: 'vm:0', order: 0, description: '' })
  }

  return {
    label: test.label,
    evaluation: test.evaluation,
    nextStepId: steps.length,

    steps,
  }
}

type Action =
  | { type: 'setLabel'; label: string }
  | { type: 'setEvaluation'; evaluation: string }
  | { type: 'createStep' }
  | { type: 'changeStepDescription'; stepId: string; description: string }
  | { type: 'deleteStep'; stepId: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setLabel':
      return { ...state, label: action.label }
    case 'setEvaluation':
      return { ...state, evaluation: action.evaluation }
    case 'createStep':
      return {
        ...state,
        steps: [
          ...state.steps,
          {
            status: 'new',
            id: `vm:${state.nextStepId}`,
            order: state.steps.length,
            description: '',
          },
        ],
        nextStepId: state.nextStepId + 1,
      }
    case 'changeStepDescription': {
      const steps = state.steps.map((step) => {
        if (step.id === action.stepId) {
          return { ...step, description: action.description }
        }

        return step
      })

      return { ...state, steps }
    }

    case 'deleteStep': {
      const steps = state.steps
        .map((step) => {
          if (step.id === action.stepId) {
            if (step.status === 'new') {
              return null
            }

            return { ...step, deleted: true }
          }

          return step
        })
        .filter((s) => s !== null)

      return { ...state, steps }
    }

    default:
      return state
  }
}

export function TestEditor({ test }: { test: TTest }) {
  const [state, dispatch] = useReducer(reducer, getInitialState(test))

  const action = useMemo(() => saveTest.bind(null, test.id, state), [test.id, state])

  return (
    <Fragment>
      <PageHeader
        title={test.label}
        subtitle={`Suite ID: ${test.suiteId} | Test ID: ${test.id}`}
        back={{ href: `/suite/${test.suiteId}/test/${test.id}`, label: 'Back to Test' }}
      />

      {/* Test Meta */}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Label</h3>
          <Input value={state.label} onChange={(e) => dispatch({ type: 'setLabel', label: e.target.value })} />
        </div>

        {/* Test Steps */}

        <SectionHeader title="Steps" actions={[]} />

        <TestWritingGuide />

        {state.steps.map((step) => (
          <div key={step.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 py-3">
              <h3 className="text-lg font-medium">Step {step.order + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: 'deleteStep', stepId: step.id })}
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={step.description}
              onChange={(e) =>
                dispatch({ type: 'changeStepDescription', stepId: step.id, description: e.target.value })
              }
            />
          </div>
        ))}

        <Button onClick={() => dispatch({ type: 'createStep' })}>Add Step</Button>

        <EvaluationWritingGuide />

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Evaluation</h3>
          <Textarea
            value={state.evaluation}
            onChange={(e) => dispatch({ type: 'setEvaluation', evaluation: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <form action={action} className="mt-5">
        <Button className="w-full" type="submit" disabled={state.steps.length === 0}>
          Save
        </Button>
      </form>
    </Fragment>
  )
}

function TestWritingGuide() {
  return (
    <div className="relative flex flex-col gap-4 p-8 rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Gradient orb in top right corner */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-radial from-green-700 via-green-400 to-green-200 blur-3xl opacity-60 pointer-events-none z-0"
        style={{ transform: 'translate(40%,-40%)' }}
      />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">Steps Writing Guide</h3>
        <p className="text-gray-600 mb-5 text-base">Write test steps that are clear and easy to understand.</p>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-green-600" />
            <span className="text-gray-800">Describe the action to be taken.</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-green-600" />
            <span className="text-gray-800">Describe the expected result of each step.</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-green-600" />
            <span className="text-gray-800">
              Be precise and specific. <br />
              <span className="text-gray-600 text-sm">
                (e.g. &quot;Select Paris as departure location&quot;, &quot; Type London as destination and select
                London as destination from the dropdown&quot;).
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function EvaluationWritingGuide() {
  return (
    <div className="relative flex flex-col gap-4 p-8 rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Gradient orb in top right corner */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-radial from-blue-700 via-blue-400 to-blue-200 blur-3xl opacity-60 pointer-events-none z-0"
        style={{ transform: 'translate(40%,-40%)' }}
      />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">Evaluation Writing Guide</h3>
        <p className="text-gray-600 mb-5 text-base">
          Evaluation should clearly describe everything that is expected to be true. Follow examples below!
        </p>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-blue-600" />
            <span className="text-gray-800">&quot;There&apos;s at least one search result&quot;.</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-blue-600" />
            <span className="text-gray-800">&quot;There are no search results&quot;.</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="flex-none w-3 h-3 text-blue-600" />
            <span className="text-gray-800">&quot;All search results show flights from Paris to London&quot;.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
