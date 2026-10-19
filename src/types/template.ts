import { Block } from "./block";

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: "japanese" | "general" | "custom";
  tags: string[];
  blocks: Block[];
  isCustom?: boolean;
  createdAt?: number;
}
