import { db, JapaneseStudyDatabase } from "./db";
import { DocumentTemplate } from "@/types/template";
import { Block } from "@/types/block";
import { cloneBlocks } from "@/lib/initial-data";
import { BUILTIN_TEMPLATES } from "@/features/templates/builtin-templates";

export class TemplateRepository {
  constructor(private database: JapaneseStudyDatabase = db) {}

  async getAll(): Promise<DocumentTemplate[]> {
    const customTemplates = await this.database.templates.toArray();
    // Gộp built-in và custom (tránh trùng id nếu có)
    const customMap = new Map(customTemplates.map((t) => [t.id, t]));
    const list: DocumentTemplate[] = [...BUILTIN_TEMPLATES];

    for (const custom of customTemplates) {
      if (!list.some((t) => t.id === custom.id)) {
        list.push(custom);
      }
    }

    return list;
  }

  async createCustom(data: {
    name: string;
    description: string;
    category?: "japanese" | "general" | "custom";
    tags?: string[];
    blocks: Block[];
  }): Promise<DocumentTemplate> {
    const newTemplate: DocumentTemplate = {
      id: "tpl_custom_" + Date.now().toString(),
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category || "custom",
      tags: data.tags || [],
      blocks: cloneBlocks(data.blocks),
      isCustom: true,
      createdAt: Date.now(),
    };

    await this.database.templates.add(newTemplate);
    return newTemplate;
  }

  async deleteCustom(id: string): Promise<void> {
    await this.database.templates.delete(id);
  }
}

export const templateRepo = new TemplateRepository();
