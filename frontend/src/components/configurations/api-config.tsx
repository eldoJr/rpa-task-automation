import { Input } from "@/components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Label } from "@/components/ui/label/label";
import { APIConfig } from "./automation";

interface APIConfigProps {
  config: APIConfig;
  onUpdate: (config: APIConfig) => void;
}

export const APIConfigForm = ({ config, onUpdate }: APIConfigProps) => {
  const handleMethodChange = (method: string) => {
    onUpdate({ ...config, method });
  };

  const handleHeaderChange = (key: string, value: string) => {
    const newHeaders = { ...config.headers, [key]: value };
    onUpdate({ ...config, headers: newHeaders });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Endpoint URL</Label>
          <Input
            value={config.endpoint}
            onChange={(e) => onUpdate({ ...config, endpoint: e.target.value })}
            placeholder="https://api.example.com/endpoint"
          />
        </div>

        <div>
          <Label>HTTP Method</Label>
          <Select value={config.method} onValueChange={handleMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Headers</Label>
        <div className="space-y-2">
          {Object.entries(config.headers).map(([key, value]) => (
            <div key={key} className="grid grid-cols-5 gap-2 items-center">
              <Input
                className="col-span-2"
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  newHeaders[e.target.value] = value;
                  onUpdate({ ...config, headers: newHeaders });
                }}
              />
              <Input
                className="col-span-2"
                value={value}
                onChange={(e) => handleHeaderChange(key, e.target.value)}
              />
              <button
                className="text-red-500"
                onClick={() => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  onUpdate({ ...config, headers: newHeaders });
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="text-sm text-blue-500"
            onClick={() => {
              const newHeaders = { ...config.headers, "": "" };
              onUpdate({ ...config, headers: newHeaders });
            }}
          >
            + Add Header
          </button>
        </div>
      </div>

      <div>
        <Label>Request Body (JSON)</Label>
        <Textarea
          value={config.body || ""}
          onChange={(e) => onUpdate({ ...config, body: e.target.value })}
          rows={4}
          className="font-mono text-sm"
          placeholder="Enter JSON payload"
        />
      </div>

      <div>
        <Label>Authentication</Label>
        <div className="space-y-2 mt-2">
          <Select
            value={config.authentication?.type || "none"}
            onValueChange={(type) => {
              if (type === "none") {
                onUpdate({ ...config, authentication: undefined });
              } else {
                onUpdate({
                  ...config,
                  authentication: {
                    type: type as "basic" | "oauth" | "apiKey",
                    credentials: {},
                  },
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select authentication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
              <SelectItem value="oauth">OAuth</SelectItem>
              <SelectItem value="apiKey">API Key</SelectItem>
            </SelectContent>
          </Select>

          {config.authentication && (
            <div className="space-y-2 p-2 border rounded">
              {config.authentication.type === "basic" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={config.authentication.credentials.username || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              username: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={config.authentication.credentials.password || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              password: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {config.authentication.type === "apiKey" && (
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <Label>Key</Label>
                    <Input
                      value={config.authentication.credentials.key || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              key: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Value</Label>
                    <Input
                      value={config.authentication.credentials.value || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              value: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Select
                      value={config.authentication.credentials.in || "header"}
                      onValueChange={(value) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              in: value as "header" | "query",
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="query">Query Param</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {config.authentication.type === "oauth" && (
                <div className="space-y-2">
                  <div>
                    <Label>Token URL</Label>
                    <Input
                      value={config.authentication.credentials.tokenUrl || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...config,
                          authentication: {
                            ...config.authentication,
                            credentials: {
                              ...config.authentication.credentials,
                              tokenUrl: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        value={config.authentication.credentials.clientId || ""}
                        onChange={(e) =>
                          onUpdate({
                            ...config,
                            authentication: {
                              ...config.authentication,
                              credentials: {
                                ...config.authentication.credentials,
                                clientId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        value={
                          config.authentication.credentials.clientSecret || ""
                        }
                        onChange={(e) =>
                          onUpdate({
                            ...config,
                            authentication: {
                              ...config.authentication,
                              credentials: {
                                ...config.authentication.credentials,
                                clientSecret: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
