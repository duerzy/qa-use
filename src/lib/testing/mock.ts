import type { TestDefinition, TestSuiteDefinition } from '@/lib/testing/engine'
import { createTest } from '@/lib/testing/engine'

export const SKYSCANNER_PASSING_SEARCH_TEST: TestDefinition = createTest({
  label: 'Passing Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in Ljubljana as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation:
    'The app should end on the results page showing at least one flight result going from Zurich to Ljubljana',
})

export const SKYSCANNER_FAILING_EVAL_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Evaluation Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in Ljubljana as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation: 'The app should end on the results page showing "Wrong date" error.',
})

export const SKYSCANNER_FAILING_TEST_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Test Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in moon as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation: 'The app should end on the results page showing at least one flight result going from Zurich to moon',
})

export const SKYSCANNER_TEST_SUITE: TestSuiteDefinition = {
  label: 'Skyscanner',
  domain: 'skyscanner.com',
  tests: [
    //
    SKYSCANNER_PASSING_SEARCH_TEST,
    SKYSCANNER_FAILING_EVAL_SEARCH_TEST,
    SKYSCANNER_FAILING_TEST_SEARCH_TEST,
  ],
}
