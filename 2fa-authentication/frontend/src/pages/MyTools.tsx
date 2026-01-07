import { useState, useEffect } from 'react';
import { api, Tool, CreateToolData } from '@/lib/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolModal } from '@/components/tools/ToolModal';
import { DeleteToolDialog } from '@/components/tools/DeleteToolDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Wrench } from 'lucide-react';

export default function MyTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToolModal, setShowToolModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMyTools();
      setTools(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your tools',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleCreateOrUpdate = async (data: CreateToolData) => {
    setIsSubmitting(true);
    try {
      if (selectedTool) {
        await api.updateTool(selectedTool.id, data);
        toast({ title: 'Tool updated successfully' });
      } else {
        await api.createTool(data);
        toast({ title: 'Tool submitted for review' });
      }
      setShowToolModal(false);
      setSelectedTool(null);
      fetchTools();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTool) return;
    setIsSubmitting(true);
    try {
      await api.deleteTool(selectedTool.id);
      toast({ title: 'Tool deleted successfully' });
      setShowDeleteDialog(false);
      setSelectedTool(null);
      fetchTools();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (tool: Tool) => {
    setSelectedTool(tool);
    setShowToolModal(true);
  };

  const openDeleteDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setShowDeleteDialog(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Tools</h1>
            <p className="text-muted-foreground mt-1">
              Manage the tools you've shared with the community
            </p>
          </div>
          <Button
            variant="gradient"
            onClick={() => {
              setSelectedTool(null);
              setShowToolModal(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create New Tool
          </Button>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tools yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any tools. Share your first tool with the community!
            </p>
            <Button
              variant="gradient"
              onClick={() => {
                setSelectedTool(null);
                setShowToolModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Create Your First Tool
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                showActions
                onEdit={openEditModal}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}
      </div>

      <ToolModal
        open={showToolModal}
        onClose={() => {
          setShowToolModal(false);
          setSelectedTool(null);
        }}
        onSubmit={handleCreateOrUpdate}
        tool={selectedTool}
        isLoading={isSubmitting}
      />

      <DeleteToolDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedTool(null);
        }}
        onConfirm={handleDelete}
        toolName={selectedTool?.name || ''}
        isLoading={isSubmitting}
      />
    </MainLayout>
  );
}
