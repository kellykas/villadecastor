import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  bucket: 'services-images' | 'projects-images' | 'blog-images';
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ImageUpload = ({ bucket, currentUrl, onUpload, onRemove }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ 
        title: 'Invalid file type', 
        description: 'Please upload JPEG, PNG, WebP, or GIF images only', 
        variant: 'destructive' 
      });
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({ 
        title: 'File too large', 
        description: 'Please upload images smaller than 5MB', 
        variant: 'destructive' 
      });
      e.target.value = '';
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUpload(publicUrl);
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image</Label>
      {currentUrl ? (
        <div className="relative inline-block">
          <img 
            src={currentUrl} 
            alt="Preview" 
            className="w-32 h-24 object-cover rounded-lg border border-border"
          />
          {onRemove && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={onRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            disabled={uploading}
            className="max-w-[250px]"
          />
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
      )}
      {currentUrl && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            disabled={uploading}
            className="max-w-[250px]"
          />
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
