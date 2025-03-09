
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import { Mod } from './ModCard';

interface ModFormProps {
  mod?: Mod;
  onSubmit: (mod: Omit<Mod, 'id'>) => void;
  onCancel: () => void;
}

const ModForm: React.FC<ModFormProps> = ({ 
  mod, 
  onSubmit, 
  onCancel 
}) => {
  const [title, setTitle] = useState(mod?.title || '');
  const [image, setImage] = useState(mod?.image || '');
  const [description, setDescription] = useState(mod?.description || '');
  const [url, setUrl] = useState(mod?.url || '');
  const [repackPrice, setRepackPrice] = useState(mod?.repackPrice || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      image,
      description,
      url,
      repackPrice
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Mod Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter mod title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Mod Image</label>
        <ImageUpload currentImage={image} onImageChange={setImage} />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter mod description"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">Steam URL</label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Steam workshop URL"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="repackPrice" className="text-sm font-medium">Repack Price</label>
        <Input
          id="repackPrice"
          value={repackPrice}
          onChange={(e) => setRepackPrice(e.target.value)}
          placeholder="e.g. 10€"
          required
        />
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button type="submit" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save Mod
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ModForm;
