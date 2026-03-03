import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Tag, Share2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  getBrandingItem,
  likeBrandingItem,
  unlikeBrandingItem,
  addAdditionalMedia,
  type BrandingIdentityItem,
} from "@/lib/brandingIdentityService";
import { uploadFile } from "@/lib/uploadService";

const BrandingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [item, setItem] = useState<BrandingIdentityItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await getBrandingItem(id);
      setItem(data);
      setLikesCount(data.likes || 0);
      
      // Check if current user has liked this item
      if (user && data.likedBy) {
        setIsLiked(data.likedBy.includes(user.id));
      }
    } catch (error: any) {
      console.error('Error loading item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load item",
      });
      navigate('/portfolio/branding-identity');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('showAuthPopup'));
      return;
    }

    if (!id) return;

    try {
      if (isLiked) {
        const result = await unlikeBrandingItem(id);
        setLikesCount(result.likes);
        setIsLiked(false);
        toast({
          title: "Success",
          description: "Removed from favorites",
        });
      } else {
        const result = await likeBrandingItem(id);
        setLikesCount(result.likes);
        setIsLiked(true);
        toast({
          title: "Success",
          description: "Added to favorites!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update like status",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && item) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      });
    }
  };

  // Get all media items (main + additional)
  const getAllMedia = () => {
    if (!item) return [];
    const allMedia = [
      { mediaType: item.mediaType, mediaUrl: item.mediaUrl, fileFormat: item.fileFormat || '' }
    ];
    if (item.additionalMedia && item.additionalMedia.length > 0) {
      const additional = item.additionalMedia.map(media => ({
        mediaType: media.mediaType,
        mediaUrl: media.mediaUrl,
        fileFormat: media.fileFormat || ''
      }));
      allMedia.push(...additional);
    }
    return allMedia;
  };

  const handlePreviousMedia = () => {
    const totalMedia = getAllMedia().length;
    setCurrentMediaIndex((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    const totalMedia = getAllMedia().length;
    setCurrentMediaIndex((prev) => (prev === totalMedia - 1 ? 0 : prev + 1));
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview('');
    }
  };

  const handleAddMedia = async () => {
    if (!selectedFile || !id) return;

    setUploading(true);
    try {
      // Upload file first
      const uploadResult = await uploadFile(selectedFile);
      console.log('Upload result:', uploadResult);
      
      // Get the URL from the upload response
      const uploadedUrl = uploadResult.data.url;
      
      if (!uploadedUrl) {
        throw new Error('Upload failed: No URL returned');
      }
      
      // Determine media type from file
      const mediaType: 'image' | 'video' = selectedFile.type.startsWith('video/') ? 'video' : 'image';
      const fileFormat = selectedFile.name.split('.').pop() || '';
      
      const mediaData = {
        mediaType,
        mediaUrl: uploadedUrl,
        fileFormat
      };
      
      console.log('Sending media data:', mediaData);

      // Add to database
      const updatedItem = await addAdditionalMedia(id, mediaData);

      setItem(updatedItem);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      handleFileRemove();
      
      toast({
        title: "Success",
        description: "Additional media added successfully!",
      });
    } catch (error: any) {
      console.error('Error adding media:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to add media",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <Button
              onClick={() => navigate('/branding-identity')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/branding-identity')}
          variant="outline"
          className="mb-8 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Media Section with Carousel */}
          <div className="space-y-4">
            <Card className="overflow-hidden relative">
              <CardContent className="p-0">
                {(() => {
                  const allMedia = getAllMedia();
                  const currentMedia = allMedia[currentMediaIndex];
                  
                  return currentMedia.mediaType === "video" ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      key={currentMedia.mediaUrl}
                      className="w-full h-auto max-h-[600px] object-contain bg-black"
                      src={currentMedia.mediaUrl}
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        // If video is shorter than 10 seconds, enable autoplay and loop
                        if (video.duration <= 10) {
                          video.muted = true;
                          video.loop = true;
                          video.play().catch(err => console.log('Autoplay prevented:', err));
                        }
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      key={currentMedia.mediaUrl}
                      src={currentMedia.mediaUrl}
                      alt={item.title}
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  );
                })()}
                
                {/* Navigation Arrows - Show only if multiple media */}
                {getAllMedia().length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={handlePreviousMedia}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={handleNextMedia}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    
                    {/* Media Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                      {currentMediaIndex + 1} / {getAllMedia().length}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                className="flex-1"
                onClick={handleLikeToggle}
              >
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'} ({likesCount})
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              {/* Add Media Button - Admin Only */}
              {user && user.role === 'admin' && (
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Media
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Additional Media</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Drag & Drop Additional Media</Label>
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          onFileRemove={handleFileRemove}
                          preview={filePreview}
                          accept="image/*,video/*"
                          maxSize={100}
                        />
                        <p className="text-xs text-muted-foreground">
                          Drag & drop or click to upload images or videos (max 100MB)
                        </p>
                      </div>
                      <Button 
                        onClick={handleAddMedia} 
                        disabled={!selectedFile || uploading}
                        className="w-full"
                      >
                        {uploading ? "Uploading..." : "Upload Media"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">{item.title}</h1>
              
              {item.featured && (
                <Badge variant="default" className="mb-4">
                  Featured Project
                </Badge>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  {item.fileFormat.toUpperCase()}
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {item.description}
                </p>
              </CardContent>
            </Card>

            {item.tags && item.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-3">Project Details</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Media Type:</dt>
                    <dd className="font-medium capitalize">{item.mediaType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Format:</dt>
                    <dd className="font-medium">{item.fileFormat.toUpperCase()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Likes:</dt>
                    <dd className="font-medium">{likesCount}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrandingDetailPage;
