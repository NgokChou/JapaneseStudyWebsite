import * as React from "react";
import { DocumentMeta } from "@/types/document";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge, CategoryBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Edit3, Eye, Trash2, Calendar, FileText } from "lucide-react";

interface DocumentCardProps {
  document: DocumentMeta;
  onEdit: (doc: DocumentMeta) => void;
  onPreview: (doc: DocumentMeta) => void;
  onDelete: (doc: DocumentMeta) => void;
}

export function DocumentCard({ document, onEdit, onPreview, onDelete }: DocumentCardProps) {
  return (
    <Card className="hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <CardHeader className="p-4.5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <CategoryBadge category={document.category} />
            <Badge variant="jlpt" level={document.level}>
              {document.level}
            </Badge>
          </div>
          <h4 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {document.title}
          </h4>
          {document.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {document.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="px-4.5 py-2">
          {/* Metadata info */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {document.itemCount} mục
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(document.updatedAt)}
            </span>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => onEdit(document)}
            className="h-8 px-2.5 text-xs font-semibold"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            Soạn thảo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(document)}
            className="h-8 px-2 text-xs text-slate-600"
            title="Xem trước bản in"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(document)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          title="Xóa tài liệu"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
