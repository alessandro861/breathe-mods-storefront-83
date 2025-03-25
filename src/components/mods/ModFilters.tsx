
import React, { useState } from 'react';
import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';

export type ModTag = 'weapon' | 'medic' | 'reward' | 'UI' | 'vehicles' | 'gear' | 'storage';
export type SortOption = 'name' | 'price-high' | 'price-low' | 'date';

export interface ModFiltersProps {
  minPrice: number;
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  onTagsChange: (tags: ModTag[]) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: SortOption) => void;
  selectedTags: ModTag[];
  selectedSort: SortOption;
  priceRange: [number, number];
  searchTerm: string;
}

const ModFilters = ({
  minPrice = 0,
  maxPrice = 100,
  onPriceRangeChange,
  onTagsChange,
  onSearchChange,
  onSortChange,
  selectedTags,
  selectedSort,
  priceRange,
  searchTerm
}: ModFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagToggle = (tags: string[]) => {
    onTagsChange(tags as ModTag[]);
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-6 border border-border">
      <div className="flex flex-col space-y-4">
        {/* Search and Toggle Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des mods..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? 'bg-primary/20' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Select value={selectedSort} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="price-high">Prix (Haut)</SelectItem>
              <SelectItem value="price-low">Prix (Bas)</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-border">
            {/* Price Range */}
            <div>
              <div className="flex justify-between mb-2">
                <Label>Tranche de prix</Label>
                <span className="text-sm text-muted-foreground">
                  {priceRange[0]}€ - {priceRange[1]}€
                </span>
              </div>
              <Slider
                value={priceRange}
                min={minPrice}
                max={maxPrice}
                step={1}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                className="mb-6"
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="mb-2 block">Tags</Label>
              <ToggleGroup 
                type="multiple" 
                className="flex flex-wrap gap-2"
                value={selectedTags}
                onValueChange={handleTagToggle}
              >
                <ToggleGroupItem value="weapon" className="text-xs">Armes</ToggleGroupItem>
                <ToggleGroupItem value="medic" className="text-xs">Médical</ToggleGroupItem>
                <ToggleGroupItem value="reward" className="text-xs">Récompenses</ToggleGroupItem>
                <ToggleGroupItem value="UI" className="text-xs">Interface</ToggleGroupItem>
                <ToggleGroupItem value="vehicles" className="text-xs">Véhicules</ToggleGroupItem>
                <ToggleGroupItem value="gear" className="text-xs">Équipement</ToggleGroupItem>
                <ToggleGroupItem value="storage" className="text-xs">Stockage</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModFilters;
