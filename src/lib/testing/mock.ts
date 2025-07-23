import { createTest, TestDefinition, TestSuiteDefinition } from './engine'

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

export const SKYSCANNER_FAILING_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Skyscanner Search',
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

export const SKYSCANNER_TEST_SUITE: TestSuiteDefinition = {
  label: 'Skyscanner',
  tests: [
    //
    SKYSCANNER_PASSING_SEARCH_TEST,
    SKYSCANNER_FAILING_SEARCH_TEST,
  ],
}
