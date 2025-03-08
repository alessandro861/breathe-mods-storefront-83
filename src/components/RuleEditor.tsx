
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pen, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RuleEditorProps {
  title: string;
  content: string;
  onSave: (newContent: string) => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ title, content, onSave }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedContent);
    setOpen(false);
    toast({
      title: "Rule updated",
      description: `${title} has been updated successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea 
            value={editedContent} 
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RuleEditor;
