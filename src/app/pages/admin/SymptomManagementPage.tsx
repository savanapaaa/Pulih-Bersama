import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useApp, Symptom } from '../../context/AppContext';
import { Plus, Pencil, Trash, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export const SymptomManagementPage: React.FC = () => {
  const { symptoms, addSymptom, updateSymptom, deleteSymptom } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [formData, setFormData] = useState({ code: '', text: '', weight: 0, category: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenDialog = (symptom?: Symptom) => {
    if (symptom) {
      setEditingSymptom(symptom);
      setFormData({ code: symptom.code, text: symptom.text, weight: symptom.weight, category: symptom.category });
    } else {
      setEditingSymptom(null);
      setFormData({ code: '', text: '', weight: 0, category: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (editingSymptom) {
        await updateSymptom(editingSymptom.id, formData);
        toast.success('Gejala berhasil diperbarui!');
      } else {
        await addSymptom(formData);
        toast.success('Gejala berhasil ditambahkan!');
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal menyimpan gejala. Coba lagi.';
      toast.error(message);
      console.error('Save symptom error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus gejala ini?')) return;

    try {
      await deleteSymptom(id);
      toast.success('Gejala berhasil dihapus!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Gagal menghapus gejala. Coba lagi.';
      toast.error(message);
      console.error('Delete symptom error:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Gejala</h1>
          <p className="text-gray-600">Kelola gejala untuk Certainty Factor</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-[#93c5fd] to-[#ddd6fe] text-[#1e3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Gejala
        </Button>
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Gejala</TableHead>
                <TableHead>Bobot</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symptoms.map((symptom) => (
                <TableRow key={symptom.id}>
                  <TableCell className="font-mono">{symptom.code}</TableCell>
                  <TableCell className="max-w-md">{symptom.text}</TableCell>
                  <TableCell>{symptom.weight}</TableCell>
                  <TableCell>{symptom.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleOpenDialog(symptom)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(symptom.id)} className="text-red-600 hover:bg-red-50">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSymptom ? 'Edit Gejala' : 'Tambah Gejala Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kode Gejala</Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="G001" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Gejala</Label>
              <Input value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} placeholder="Deskripsi gejala" />
            </div>
            <div className="space-y-2">
              <Label>Bobot Expert (0-1)</Label>
              <Input type="number" step="0.1" min="0" max="1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Gangguan Tidur & Keluhan Fisik" />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-[#93c5fd] text-[#1e3a8a]">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
