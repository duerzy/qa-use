import type { TestDefinition, TestSuiteDefinition } from '@/lib/testing/engine'
import { createTest } from '@/lib/testing/engine'

export const DOCS_PASSING_SEARCH_TEST: TestDefinition = createTest({
  label: 'Passing BrowserUse Docs Search',
  steps: [
    'Go to docs.browser-use.com',
    'Find the search input in the header.',
    'Type "API" into the search input.',
    'Press enter or click the search button.',
  ],
  evaluation:
    'The page should show search results related to "API", and at least one result should mention "Implementing the API".',
})

/**
 * A test example that fails because the evaluation is not met.
 */
export const DOCS_FAILING_EVAL_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Evaluation BrowserUse Docs Search',
  steps: [
    'Go to docs.browser-use.com',
    'Find the search input in the header.',
    'Type "API" into the search input.',
    'Press enter or click the search button.',
  ],
  evaluation: 'The page should display an error message saying "No results found for API".',
})

/**
 * A test example that fails because the test step cannot be completed.
 */
export const DOCS_FAILING_TEST_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Test BrowserUse Docs Search',
  steps: [
    'Go to docs.browser-use.com',
    'Click edit documentation button in the top right corner.',
    'Edit the documentation title to "Moonbase".',
    'Click save button.',
  ],
  evaluation: 'The page should show the documentation title "Moonbase".',
})

export const BROWSERUSE_DOCS_TEST_SUITE: TestSuiteDefinition = {
  label: 'BrowserUse Docs',
  domain: 'docs.browser-use.com',
  tests: [
    //
    DOCS_PASSING_SEARCH_TEST,
    DOCS_FAILING_EVAL_SEARCH_TEST,
    DOCS_FAILING_TEST_SEARCH_TEST,
  ],
}
