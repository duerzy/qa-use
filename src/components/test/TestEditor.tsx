'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useReducer } from 'react'

import { saveTest } from '@/app/suite/[suiteId]/test/[testId]/edit/actions'
import type { TTest } from '@/app/suite/[suiteId]/test/[testId]/edit/loader'

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
  task: string
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
    task: test.task,
    evaluation: test.evaluation,
    nextStepId: steps.length,

    steps,
  }
}

type Action =
  | { type: 'setLabel'; label: string }
  | { type: 'setTask'; task: string }
  | { type: 'setEvaluation'; evaluation: string }
  | { type: 'createStep' }
  | { type: 'changeStepDescription'; stepId: string; description: string }
  | { type: 'deleteStep'; stepId: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setLabel':
      return { ...state, label: action.label }
    case 'setTask':
      return { ...state, task: action.task }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Edit Test</h2>

        <div className="flex items-center justify-between mb-8">
          <Link href={`/suite/${test.suiteId}/test/${test.id}`} className="text-sm text-gray-500">
            Back to Test
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 gap-4">
        {/* Test Meta */}
        <div className="col-span-1 flex flex-col gap-3">
          <h2 className="text-lg font-medium">Test Details</h2>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Label</h3>
            <Input value={state.label} onChange={(e) => dispatch({ type: 'setLabel', label: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Task</h3>
            <Textarea
              value={state.task}
              onChange={(e) => dispatch({ type: 'setTask', task: e.target.value })}
              rows={8}
            />
          </div>
        </div>

        {/* Test Steps */}

        <div className="col-span-1 flex flex-col gap-3">
          <h2 className="text-lg font-medium">Steps</h2>

          {state.steps.map((step) => (
            <div key={step.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Step {step.order + 1}</h3>
                <Button
                  variant="outline"
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

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Evaluation</h3>
            <Textarea
              value={state.evaluation}
              onChange={(e) => dispatch({ type: 'setEvaluation', evaluation: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form action={action}>
          <Button type="submit">Save</Button>
        </form>
      </div>
    </div>
  )
}
