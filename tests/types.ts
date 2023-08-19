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

export interface TestReport {
  title: string;
  description: string;
  isSuccess: boolean;
  message: string;
  stack: string;
}
