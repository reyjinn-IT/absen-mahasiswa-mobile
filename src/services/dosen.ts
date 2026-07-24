import { api } from './api';

export interface DosenDashboard {
  total_kelas: number;
  total_mahasiswa: number;
  absensi_hari_ini: number;
  kelas_list: DosenKelas[];
}

export interface DosenKelas {
  id: number;
  nama: string;
  matakuliah: {
    id: number;
    nama: string;
    kode: string;
  };
  mahasiswa_count: number;
}

export interface AbsensiRecord {
  id: number;
  mahasiswa_id: number;
  mahasiswa: {
    id: number;
    name: string;
    nim: string;
  };
  kelas_id: number;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan?: string;
}

export interface AbsensiManualPayload {
  kelas_id: number;
  mahasiswa_id: number;
  tanggal: string;
  status: string;
  keterangan?: string;
}

export interface RekapAbsensi {
  mahasiswa_id: number;
  mahasiswa: {
    name: string;
    nim: string;
  };
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  persentase: number;
}

export const dosenService = {
  getDashboard(): Promise<DosenDashboard> {
    return api.get<DosenDashboard>('/dosen/dashboard');
  },

  getKelasDosen(): Promise<DosenKelas[]> {
    return api.get<DosenKelas[]>('/dosen/kelas');
  },

  getAbsensiKelas(kelasId: number, tanggal?: string): Promise<AbsensiRecord[]> {
    const query = tanggal ? `?tanggal=${tanggal}` : '';
    return api.get<AbsensiRecord[]>(`/dosen/kelas/${kelasId}/absensi${query}`);
  },

  inputAbsensiManual(payload: AbsensiManualPayload): Promise<AbsensiRecord> {
    return api.post<AbsensiRecord>('/dosen/absensi/manual', payload);
  },

  getRekapAbsensi(kelasId: number): Promise<RekapAbsensi[]> {
    return api.get<RekapAbsensi[]>(`/dosen/kelas/${kelasId}/rekap`);
  },
};