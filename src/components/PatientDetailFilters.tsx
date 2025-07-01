
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

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
        return "Buscar por notas ou diagnóstico...";
      case "documents":
        return "Buscar por nome do documento...";
      case "financial":
        return "Buscar por descrição...";
      default:
        return "Buscar...";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Ordenar por" />
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
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por" />
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
      
      <Button variant="outline" onClick={onClearFilters}>
        <X className="h-4 w-4 mr-2" />
        Limpar
      </Button>
    </div>
  );
};

export default PatientDetailFilters;
