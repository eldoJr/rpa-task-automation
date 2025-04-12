export interface BaseConfig {
  name: string;
  description?: string;
}

export interface APIConfig extends BaseConfig {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  authentication?: {
    type: "basic" | "oauth" | "apiKey";
    credentials: Record<string, string>;
  };
}

export interface ConditionConfig extends BaseConfig {
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  logicalOperator: "and" | "or";
}
