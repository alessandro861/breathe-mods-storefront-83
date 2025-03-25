
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ModTag } from './ModFilters';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Le titre doit contenir au moins 3 caractères',
  }),
  description: z.string().min(10, {
    message: 'La description doit contenir au moins 10 caractères',
  }),
  url: z.string().url({
    message: 'Veuillez entrer une URL valide',
  }),
  repackPrice: z.string().optional(),
  image: z.string().optional(),
  isPaid: z.boolean().default(false),
  date: z.string().optional(),
});

type FormData = z.infer<typeof formSchema> & {
  tags?: ModTag[];
};

interface ModFormProps {
  mod?: any;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isPaidOnly?: boolean;
}

const ModForm = ({ mod, onSubmit, onCancel, isPaidOnly = false }: ModFormProps) => {
  const [selectedTags, setSelectedTags] = useState<ModTag[]>(mod?.tags || []);
  const [imageUrl, setImageUrl] = useState<string>(mod?.image || '');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: mod?.title || '',
      description: mod?.description || '',
      url: mod?.url || '',
      repackPrice: mod?.repackPrice || '',
      image: mod?.image || '',
      isPaid: isPaidOnly ? true : mod?.isPaid || false,
      date: mod?.date || new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = (data: FormData) => {
    const finalData = {
      ...data,
      image: imageUrl,
      tags: selectedTags,
    };
    onSubmit(finalData);
  };

  const handleTagToggle = (tags: string[]) => {
    setSelectedTags(tags as ModTag[]);
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du mod" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="mb-4">
          <FormLabel>Image</FormLabel>
          <div className="mt-1">
            <ImageUpload
              imageUrl={imageUrl}
              onImageUpload={handleImageUpload}
              className="w-full h-48 rounded-md"
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description du mod"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://steamcommunity.com/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="mb-2 block">Tags</FormLabel>
          <ToggleGroup 
            type="multiple" 
            className="flex flex-wrap gap-2"
            value={selectedTags}
            onValueChange={handleTagToggle}
          >
            <ToggleGroupItem value="weapon">Armes</ToggleGroupItem>
            <ToggleGroupItem value="medic">Médical</ToggleGroupItem>
            <ToggleGroupItem value="reward">Récompenses</ToggleGroupItem>
            <ToggleGroupItem value="UI">Interface</ToggleGroupItem>
            <ToggleGroupItem value="vehicles">Véhicules</ToggleGroupItem>
            <ToggleGroupItem value="gear">Équipement</ToggleGroupItem>
            <ToggleGroupItem value="storage">Stockage</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {!isPaidOnly && (
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Payant</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="repackPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (€)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="10€" 
                  {...field} 
                  disabled={!isPaidOnly && !form.watch('isPaid')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {mod ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModForm;
