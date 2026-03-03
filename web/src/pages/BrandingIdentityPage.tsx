import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Play, Image as ImageIcon, X, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import GradientBlinds from "@/components/GradientBlinds.tsx";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getAllBrandingItems,
  createBrandingItem,
  deleteBrandingItem,
  type BrandingIdentityItem,
} from "@/lib/brandingIdentityService";
import { uploadFile } from "@/lib/uploadService";

const BrandingIdentityPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BrandingIdentityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "image" | "video">("all");
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    mediaType: "image" as "image" | "video",
    fileFormat: "",
    tags: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAllBrandingItems();
      setItems(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load branding items",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Auto-detect media type from file
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, mediaType: 'image' }));
    } else if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, mediaType: 'video' }));
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);

    // Auto-detect file format
    const format = file.name.split('.').pop()?.toLowerCase() || '';
    setFormData(prev => ({ ...prev, fileFormat: format }));
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview('');
    }
    setFormData(prev => ({ ...prev, mediaUrl: '', fileFormat: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload the file first
      toast({
        title: "Uploading...",
        description: "Uploading your file to the server",
      });

      const uploadResponse = await uploadFile(selectedFile);
      
      // Now create the branding item with the uploaded file URL
      await createBrandingItem({
        title: formData.title,
        description: formData.description,
        mediaUrl: uploadResponse.data.url, // Use the server URL instead of blob URL
        mediaType: formData.mediaType,
        fileFormat: formData.fileFormat,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        featured: formData.featured,
      });

      toast({
        title: "Success",
        description: "Design work uploaded successfully!",
      });

      // Reset form and file
      setFormData({
        title: "",
        description: "",
        mediaUrl: "",
        mediaType: "image",
        fileFormat: "",
        tags: "",
        featured: false,
      });
      handleFileRemove();
      setIsDialogOpen(false);
      loadItems();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to upload design work",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteBrandingItem(id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      loadItems();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item",
      });
    }
  };

  const filteredItems = items.filter((item) =>
    selectedFilter === "all" ? true : item.mediaType === selectedFilter
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="max-w-4xl space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-accent" />
              <Badge variant="outline" className="border-accent/50 text-accent px-4 py-1">
                Premium Portfolio
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold break-words">
              Luxury <span className="gradient-text">Branding Identity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl break-words">
              Explore our collection of premium branding projects. Where sophistication meets
              creativity in every design.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Upload Section */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className={selectedFilter === "all" ? "bg-accent text-accent-foreground" : ""}
              >
                All Works
              </Button>
              <Button
                variant={selectedFilter === "image" ? "default" : "outline"}
                onClick={() => setSelectedFilter("image")}
                className={selectedFilter === "image" ? "bg-accent text-accent-foreground" : ""}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </Button>
              <Button
                variant={selectedFilter === "video" ? "default" : "outline"}
                onClick={() => setSelectedFilter("video")}
                className={selectedFilter === "video" ? "bg-accent text-accent-foreground" : ""}
              >
                <Play className="w-4 h-4 mr-2" />
                Videos
              </Button>
            </div>

            {/* Upload Button (Admin Only) */}
            {user?.role === 'admin' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Work
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl gradient-text">Upload Design Work</DialogTitle>
                    <DialogDescription>
                      Add a new design work to your luxury branding portfolio
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter project title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Describe your design work"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Media File *</Label>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        preview={filePreview}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.psd,.ai,.fig"
                        maxSize={100}
                      />
                      <p className="text-xs text-muted-foreground">
                        Drag & drop or click to upload. Supports: Images (PNG, JPG, GIF, WebP), Videos (MP4, WebM, MOV), and design files (PSD, AI, Figma)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mediaType">Media Type *</Label>
                      <select
                        id="mediaType"
                        value={formData.mediaType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mediaType: e.target.value as "image" | "video",
                          })
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        required
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Auto-detected from file, but you can change it
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="branding, logo, luxury, identity"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-input"
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as featured
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {uploading ? "Uploading..." : "Upload Design"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading design works...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No design works yet</p>
              {user?.role === 'admin' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Upload Work" to add your first design
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <Card
                  key={item._id}
                  className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-500 hover:shadow-gold cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/branding-identity/${item._id}`)}
                >
                  <CardContent className="p-0">
                    {/* Media Container */}
                    <div className="relative overflow-hidden aspect-[4/3] bg-secondary/30">
                      {item.mediaType === "image" ? (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={(e) => {
                            const video = e.currentTarget;
                            if (video.duration <= 10) {
                              video.muted = true;
                              video.loop = true;
                              video.play().catch(err => console.log('Autoplay prevented:', err));
                            }
                          }}
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        {item.mediaType === "video" && (
                          <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-gold">
                            <Play className="w-8 h-8 text-accent-foreground ml-1" />
                          </div>
                        )}
                      </div>

                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-accent shadow-gold">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Delete Button (Admin Only) */}
                      {user?.role === 'admin' && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors break-words">
                          {item.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {item.fileFormat.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {item.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs border-accent/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandingIdentityPage;
