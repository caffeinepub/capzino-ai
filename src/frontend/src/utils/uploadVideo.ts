import { HttpAgent } from "@icp-sdk/core/agent";
import type { Identity } from "@icp-sdk/core/agent";
import { loadConfig } from "../config";
import { StorageClient } from "./StorageClient";

export async function uploadVideoFile(
  file: File,
  identity: Identity | undefined,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const config = await loadConfig();
  const agentOptions: { identity?: Identity; host?: string } = {
    host: config.backend_host,
  };
  if (identity) agentOptions.identity = identity;
  const agent = new HttpAgent(agentOptions);

  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }

  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { hash } = await storageClient.putFile(bytes, onProgress);
  return hash;
}

export async function getVideoDirectURL(
  hash: string,
  identity: Identity | undefined,
): Promise<string> {
  const config = await loadConfig();
  const agentOptions: { identity?: Identity; host?: string } = {
    host: config.backend_host,
  };
  if (identity) agentOptions.identity = identity;
  const agent = new HttpAgent(agentOptions);

  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );

  return storageClient.getDirectURL(hash);
}
