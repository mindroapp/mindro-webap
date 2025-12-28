import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface PatientDetailFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterBy?: string;
  onFilterChange?: (value: string) => void;
  onClearFilters: () => void;
  type: "sessions" | "documents" | "financial";
}

const PatientDetailFilters: React.FC<PatientDetailFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  onClearFilters,
  type
}) => {
  const getSortOptions = () => {
    switch (type) {
      case "sessions":
        return [
          { value: "date", label: "Data" },
          { value: "mood", label: "Humor" }
        ];
      case "documents":
        return [
          { value: "name", label: "Nome" },
          { value: "uploadDate", label: "Data de Upload" },
          { value: "type", label: "Tipo" }
        ];
      case "financial":
        return [
          { value: "date", label: "Data" },
          { value: "amount", label: "Valor" },
          { value: "status", label: "Status" }
        ];
      default:
        return [];
    }
  };

  const getFilterOptions = () => {
    switch (type) {
      case "documents":
        return [
          { value: "all", label: "Todos os tipos" },
          { value: "pdf", label: "PDF" },
          { value: "image", label: "Imagem" },
          { value: "document", label: "Documento" }
        ];
      case "financial":
        return [
          { value: "all", label: "Todos os status" },
          { value: "paid", label: "Pago" },
          { value: "pending", label: "Pendente" },
          { value: "cancelled", label: "Cancelado" }
        ];
      default:
        return [];
    }
  };

  const getSearchPlaceholder = () => {
    switch (type) {
      case "sessions":
        return "Buscar...";
      case "documents":
        return "Buscar documento...";
      case "financial":
        return "Buscar...";
      default:
        return "Buscar...";
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="flex-1 min-w-[120px] text-sm">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {getSortOptions().map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {(type === "documents" || type === "financial") && onFilterChange && (
          <Select value={filterBy || "all"} onValueChange={onFilterChange}>
            <SelectTrigger className="flex-1 min-w-[120px] text-sm">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              {getFilterOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <Button variant="outline" onClick={onClearFilters} size="sm" className="px-3">
          <X className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Limpar</span>
        </Button>
      </div>
    </div>
  );
};

export default PatientDetailFilters;
