import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Play, Image as ImageIcon, X, Code2, ExternalLink } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { webProjectService, type WebProject } from "@/lib/webProjectService";
import { uploadFile } from "@/lib/uploadService";

const WebDevelopmentPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "image" | "video">("all");
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    mediaType: "image" as "image" | "video",
    projectUrl: "",
    technologies: "",
    category: "other" as WebProject["category"],
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await webProjectService.getAll();
      setProjects(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, mediaType: 'image' }));
    } else if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, mediaType: 'video' }));
    }
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview('');
    }
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
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
      toast({
        title: "Uploading...",
        description: "Uploading your file to the server",
      });

      const uploadResponse = await uploadFile(selectedFile);

      await webProjectService.create({
        title: formData.title,
        description: formData.description,
        mediaUrl: uploadResponse.data.url,
        mediaType: formData.mediaType,
        projectUrl: formData.projectUrl,
        technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        category: formData.category,
        featured: formData.featured,
      });

      toast({
        title: "Success",
        description: "Web project added successfully!",
      });

      setFormData({
        title: "",
        description: "",
        mediaUrl: "",
        mediaType: "image",
        projectUrl: "",
        technologies: "",
        category: "other",
        featured: false,
      });
      handleFileRemove();
      
      setIsDialogOpen(false);
      loadProjects();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to upload project",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await webProjectService.delete(id);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      loadProjects();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project",
      });
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "all") return true;
    return project.mediaType === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GradientBlinds />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <Button
              onClick={() => navigate('/#portfolio')}
              variant="outline"
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-accent" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold break-words">
                    Web Design & <span className="gradient-text">Development</span>
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground break-words">
                  Cutting-edge websites that combine stunning design with powerful functionality
                </p>
              </div>

              {user?.role === "admin" && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 shadow-gold">
                      <Upload className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Web Project</DialogTitle>
                      <DialogDescription>
                        Upload your web design and development work
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="E-Commerce Platform"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief description of the project..."
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label>Media File *</Label>
                        <FileUpload
                          onFileSelect={handleFileSelect}
                          onFileRemove={handleFileRemove}
                          preview={filePreview}
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.psd,.ai,.fig"
                          maxSize={100}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Drag & drop or click to upload. All media files supported.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="mediaType">Media Type</Label>
                        <Select
                          value={formData.mediaType}
                          onValueChange={(value: "image" | "video") =>
                            setFormData({ ...formData, mediaType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Auto-detected from file
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="projectUrl">Live Project URL (Optional)</Label>
                        <Input
                          id="projectUrl"
                          type="url"
                          value={formData.projectUrl}
                          onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input
                          id="technologies"
                          value={formData.technologies}
                          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                          placeholder="React, Node.js, MongoDB, Tailwind CSS"
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value: WebProject["category"]) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="e-commerce">E-Commerce</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="portfolio">Portfolio</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="landing-page">Landing Page</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-accent"
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          Featured Project
                        </Label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          disabled={uploading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-accent hover:bg-accent/90"
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Add Project"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className={selectedFilter === "all" ? "bg-accent hover:bg-accent/90" : ""}
              >
                All Projects
              </Button>
              <Button
                variant={selectedFilter === "image" ? "default" : "outline"}
                onClick={() => setSelectedFilter("image")}
                className={selectedFilter === "image" ? "bg-accent hover:bg-accent/90" : ""}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </Button>
              <Button
                variant={selectedFilter === "video" ? "default" : "outline"}
                onClick={() => setSelectedFilter("video")}
                className={selectedFilter === "video" ? "bg-accent hover:bg-accent/90" : ""}
              >
                <Play className="w-4 h-4 mr-2" />
                Videos
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card className="p-12 text-center">
                <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No projects yet</p>
                {user?.role === "admin" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload your first web project to get started
                  </p>
                )}
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project._id}
                    className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-500 hover:shadow-gold"
                  >
                    <CardContent className="p-0">
                      {/* Media */}
                      <div className="relative overflow-hidden aspect-video">
                        {project.mediaType === "video" ? (
                          <video
                            src={project.mediaUrl}
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
                        ) : (
                          <img
                            src={project.mediaUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        {project.featured && (
                          <Badge className="absolute top-4 right-4 bg-accent shadow-gold">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <Badge variant="outline" className="mb-2 border-accent/50 text-accent">
                            {project.category}
                          </Badge>
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors break-words">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground mt-2">{project.description}</p>
                        </div>

                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          {project.projectUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => window.open(project.projectUrl, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Live
                            </Button>
                          )}
                          {user?.role === "admin" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(project._id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WebDevelopmentPage;
