export interface AppConfig {
  socketUrl: string;
  apiBaseUrl: string;
}

let config: AppConfig;

export async function loadConfig() {
  const res = await fetch("/config.json");
  config = await res.json();
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error("Config has not been loaded. Call loadConfig() first.");
  }
  return config;
}
