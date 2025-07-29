'use client'

import { Plus, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useReducer } from 'react'

import { saveTest } from '@/app/suite/[suiteId]/test/[testId]/edit/actions'
import type { TTest } from '@/app/suite/[suiteId]/test/[testId]/edit/loader'

import { SectionHeader } from '../shared/SectionHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

type Step =
  | {
      status: 'new'

      id: string
      description: string
    }
  | {
      status: 'existing'

      sourceId: number

      id: string
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
  const steps: Step[] = test.steps
    .sort((a, b) => a.order - b.order)
    .map((step) => ({
      status: 'existing',
      sourceId: step.id,
      id: `existing:${step.id}`,
      description: step.description,
      deleted: false,
    }))

  if (steps.length === 0) {
    steps.push({ status: 'new', id: 'vm:0', description: '' })
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
  const steps = useMemo(() => state.steps.filter((step) => step.status === 'new' || !step.deleted), [state.steps])

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-2 mr-auto flex-1">
          <h2 className="text-4xl font-black">Test</h2>
          <p className="text-sm text-gray-500">
            A collection of steps and an evaluation that outlines the expected outcome of the test.
          </p>
          <Input
            className="mt-1"
            value={state.label}
            onChange={(e) => dispatch({ type: 'setLabel', label: e.target.value })}
            placeholder="My test name..."
          />
        </div>

        <Link href={`/suite/${test.suiteId}/test/${test.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <form action={action}>
          <Button type="submit" disabled={state.steps.length === 0}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </form>
      </div>

      {/* Test Meta */}

      {/* Test Steps */}

      <div className="flex flex-col gap-3 mb-3">
        <SectionHeader title="Steps" subtitle="Write test steps that are clear and atomic." actions={[]} />

        {steps.map((step, index) => (
          <div key={step.id} className="grid grid-cols-12 gap-2">
            <div className="col-span-1 flex gap-1 items-center self-start">
              <h3 className="text-2xl font-black p-1">#{index + 1}</h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: 'deleteStep', stepId: step.id })}
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Textarea
              className="col-span-11"
              value={step.description}
              placeholder="Describe the action to be taken..."
              onChange={(e) =>
                dispatch({ type: 'changeStepDescription', stepId: step.id, description: e.target.value })
              }
            />
          </div>
        ))}

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1"></div>
          <Button variant="outline" className="col-span-11" onClick={() => dispatch({ type: 'createStep' })} size="sm">
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Evaluation"
          subtitle="Write an evaluation that outlines the expected outcome of the test."
          actions={[]}
        />

        <Textarea
          value={state.evaluation}
          onChange={(e) => dispatch({ type: 'setEvaluation', evaluation: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 mt-3">
        <Link href={`/suite/${test.suiteId}/test/${test.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <form action={action}>
          <Button type="submit" disabled={state.steps.length === 0}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </form>
      </div>
    </div>
  )
}
