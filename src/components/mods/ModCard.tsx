import React from 'react';
import { CalendarDays, Edit, ExternalLink, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModTag } from './ModFilters';
export interface Mod {
  id: number;
  title: string;
  image: string;
  description: string;
  url: string;
  repackPrice: string;
  isPaid: boolean;
  tags?: ModTag[];
  date?: string;
}
interface ModCardProps {
  mod: Mod;
  isAdmin: boolean;
  onEdit: (mod: Mod) => void;
  onDelete: (id: number) => void;
  onPurchase: (mod: Mod) => void;
}
const ModCard = ({
  mod,
  isAdmin,
  onEdit,
  onDelete,
  onPurchase
}: ModCardProps) => {
  // Extract numeric price for display
  const displayPrice = () => {
    if (!mod.isPaid) return "Gratuit";

    // Extract the first price if there are multiple prices
    const priceMatch = mod.repackPrice.match(/(\d+)(€|EUR)/);
    if (priceMatch) {
      return `${priceMatch[1]}€`;
    }
    return mod.repackPrice;
  };
  return <Card className="glass-panel overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img src={mod.image || "/placeholder.svg"} alt={mod.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {mod.isPaid && <div className="absolute top-0 right-0 bg-primary/90 text-white px-2 py-1 text-xs font-semibold">
            {displayPrice()}
          </div>}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{mod.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-1">
          {mod.date && <span className="flex items-center text-xs mb-1 text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1" />
              {mod.date}
            </span>}
        </CardDescription>
        {mod.tags && mod.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-1">
            {mod.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>)}
          </div>}
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-gray-300">{mod.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t border-gray-700">
        <div className="flex gap-2">
          {isAdmin && <>
              <Button size="sm" variant="ghost" onClick={() => onEdit(mod)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(mod.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </>}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.open(mod.url, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Voir
          </Button>
          
          {mod.isPaid}
        </div>
      </CardFooter>
    </Card>;
};
export default ModCard;