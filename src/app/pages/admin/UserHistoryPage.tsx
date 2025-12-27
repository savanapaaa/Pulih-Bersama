import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useApp, DiagnosisResult } from '../../context/AppContext';
import { Eye, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

export const UserHistoryPage: React.FC = () => {
  const { users, diagnosisResults } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const regularUsers = users.filter(u => u.role === 'user');
  
  const filteredUsers = regularUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserLastDiagnosis = (userId: string) => {
    const userDiagnoses = diagnosisResults.filter(d => d.userId === userId);
    return userDiagnoses[userDiagnoses.length - 1];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Ringan':
        return 'bg-[#86efac] text-[#166534]';
      case 'Sedang':
        return 'bg-[#fde68a] text-[#854d0e]';
      case 'Tinggi':
        return 'bg-[#fca5a5] text-[#991b1b]';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  if (selectedUser) {
    const user = users.find(u => u.id === selectedUser);
    const userDiagnoses = diagnosisResults.filter(d => d.userId === selectedUser);

    return (
      <div className="p-8 space-y-6">
        <Button variant="ghost" onClick={() => setSelectedUser(null)}>
          ← Kembali
        </Button>

        <Card className="border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detail Riwayat Pengguna</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telepon</p>
                <p className="font-semibold">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tes</p>
                <p className="font-semibold">{userDiagnoses.length}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Riwayat Diagnosis</h3>
            {userDiagnoses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada riwayat diagnosis</p>
            ) : (
              <div className="space-y-4">
                {userDiagnoses.map((diagnosis) => (
                  <Card key={diagnosis.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600">
                          {new Date(diagnosis.date).toLocaleDateString('id-ID')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(diagnosis.overallRisk)}`}>
                          {diagnosis.overallRisk}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>Kategori Dominan:</strong> {diagnosis.dominantCategory}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Pengguna</h1>
        <p className="text-gray-600">Lihat riwayat diagnosis semua pengguna</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-2"
        />
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tanggal Tes Terakhir</TableHead>
                <TableHead>Risiko Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const lastDiagnosis = getUserLastDiagnosis(user.id);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {lastDiagnosis
                        ? new Date(lastDiagnosis.date).toLocaleDateString('id-ID')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {lastDiagnosis ? (
                        <span className={`px-3 py-1 rounded-full text-xs ${getRiskColor(lastDiagnosis.overallRisk)}`}>
                          {lastDiagnosis.overallRisk}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user.id)}
                        className="border-[#93c5fd]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
