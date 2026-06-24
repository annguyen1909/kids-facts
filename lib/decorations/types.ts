export type DecorationStatus = "pending" | "generated" | "approved" | "rejected";

export type DecorationManifestItem = {
  id: string;
  animal: string;
  status: DecorationStatus;
  placement: string[];
  src: string | null;
  width?: number;
  height?: number;
  generatedAt: string | null;
  approvedAt?: string | null;
  promptVersion?: number;
  model?: string;
  notes?: string;
};

export type DecorationManifest = {
  version: number;
  model: string;
  promptVersion: number;
  items: DecorationManifestItem[];
};
