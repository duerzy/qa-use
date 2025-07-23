# Use QA

E2E QA testing example using BrowserUse, showcasing as many features of BrowserUse as possible, having a copy-pastable code that can easily be reused.

# Set Up

```bash
git clone
get api key
docker compose up -d
```

# Guide

Get something working quickly after that!

The core idea is to have a copy-pastable project that can be used as a spring-board for companies building internal tools with BrowserUse.

1. Automation flow that finds important parts of the application.
1. List of all tests (grouped by function or by url)
1. List of runs (suites) with lots of live video screens.
1. Test Run View (with time travel)
1. Use Scheduled Tasks to track state
1. Webhook? idk... could be annoying for local set-up because you need routing
1. Add thinking step
1. Using WorkflowUse vs reusing WorkflowUse in the code to get it up and running.

## Constraints

- no login screen
- easy docker spin up
- copy-pasteable code
- only runs locally (auth, db etc. second iteration)
- only use cloud, do not use browser-use python library

## Development Setup

```
docker compose up --watch
```
