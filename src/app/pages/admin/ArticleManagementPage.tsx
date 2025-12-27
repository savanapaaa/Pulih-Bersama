import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useApp, Article } from '../../context/AppContext';
import { Plus, Pencil, Trash, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export const ArticleManagementPage: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    category: '',
  });

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content,
        image: article.image,
        category: article.category,
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        summary: '',
        content: '',
        image: '',
        category: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingArticle) {
      updateArticle(editingArticle.id, formData);
      toast.success('Artikel berhasil diperbarui!');
    } else {
      addArticle({
        ...formData,
        date: new Date().toISOString().split('T')[0],
      });
      toast.success('Artikel berhasil ditambahkan!');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      deleteArticle(id);
      toast.success('Artikel berhasil dihapus!');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Berita</h1>
          <p className="text-gray-600">Kelola artikel dan berita</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Artikel
        </Button>
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-md">
                    <div className="line-clamp-1">{article.title}</div>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    {new Date(article.date).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(article)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul artikel"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Contoh: Psikologi Anak"
              />
            </div>
            <div className="space-y-2">
              <Label>Ringkasan</Label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Ringkasan artikel"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Konten</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Konten lengkap artikel"
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>URL Gambar</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave} className="bg-[#93c5fd] text-[#1e3a8a]">
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
