
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConfigDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  config: any;
}

const ConfigDialog: React.FC<ConfigDialogProps> = ({
  isOpen,
  setIsOpen,
  config
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <pre className="text-xs bg-black/20 p-4 rounded-md overflow-x-auto whitespace-pre">
            {JSON.stringify(config, null, 2)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigDialog;
