
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  imageUrl?: string;
  onImageUpload: (newImageUrl: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageUrl = '', 
  onImageUpload,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload
    setIsUploading(true);
    
    // In a real implementation, you would upload to a server
    // For now, let's simulate a delay and use the data URL
    setTimeout(() => {
      setIsUploading(false);
      // In a real implementation, onImageChange would receive a URL from your server
      // For now, we'll just use the preview URL
      onImageUpload(reader.result as string);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded",
      });
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="relative w-full h-40">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white text-sm font-medium">Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload an image</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        <UploadCloud className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
};

export default ImageUpload;
