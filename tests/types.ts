export interface Message {
  source: string;
  scripts: string[];
  title: string;
}

export interface Test {
  name: string;
  status: 0 | 1;
  message: string;
  stack: string;
}

export interface TestsStatus {
  message: string | null;
  stack: string | null;
  status: Statuses;
}

export enum Statuses {
  Ok,
  Error,
  Timeout,
  PreconditionFailed,
}

interface BaseTestReport {
  /** The test name. */
  name: string;

  /** A message indicating the reason for test failure. */
  message: string | null;

  /** Stack trace in case of an exception. */
  stack: string | null;

  /** The test status code.
   * - `0`: success
   * - `1`: fail
   */
  status: 0 | 1;

  index: number;
}

interface SuccessTestReport extends BaseTestReport {
  status: 0;
  message: null;
  stack: null;
}

interface FailureTestReport extends BaseTestReport {
  status: 1;
  message: string;
  stack: string;
}

export type TestReport = SuccessTestReport | FailureTestReport;

export interface Tests {
  timeout_id: number | null;
}
