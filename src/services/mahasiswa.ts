import { api } from './api';

export interface MahasiswaDashboard {
  total_kelas: number;
  absensi_hari_ini?: {
    status: string;
    waktu?: string;
  };
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
}

export interface MahasiswaKelas {
  id: number;
  nama: string;
  matakuliah: {
    id: number;
    nama: string;
    kode: string;
  };
  dosen: {
    id: number;
    name: string;
  };
}

export interface AbsensiRiwayat {
  id: number;
  kelas: {
    id: number;
    nama: string;
    matakuliah: {
      nama: string;
    };
  };
  tanggal: string;
  status: string;
  keterangan?: string;
  waktu_absen?: string;
}

export interface AbsenMasukPayload {
  kelas_id: number;
  latitude: number;
  longitude: number;
}

export interface IzinPayload {
  kelas_id: number;
  tanggal: string;
  keterangan: string;
}

export interface GantiPasswordPayload {
  password_lama: string;
  password_baru: string;
  password_baru_confirmation: string;
}

export const mahasiswaService = {
  getDashboard(): Promise<MahasiswaDashboard> {
    return api.get<MahasiswaDashboard>('/mahasiswa/dashboard');
  },

  getKelasMahasiswa(): Promise<MahasiswaKelas[]> {
    return api.get<MahasiswaKelas[]>('/mahasiswa/kelas');
  },

  absenMasuk(payload: AbsenMasukPayload): Promise<{ status: string; waktu: string }> {
    return api.post('/mahasiswa/absen/masuk', payload);
  },

  getRiwayatAbsensi(): Promise<AbsensiRiwayat[]> {
    return api.get<AbsensiRiwayat[]>('/mahasiswa/absensi/riwayat');
  },

  getRekapAbsensi(): Promise<unknown> {
    return api.get('/mahasiswa/absensi/rekap');
  },

  ajukanIzin(payload: IzinPayload): Promise<unknown> {
    return api.post('/mahasiswa/izin', payload);
  },

  gantiPassword(payload: GantiPasswordPayload): Promise<void> {
    return api.put('/mahasiswa/ganti-password', payload);
  },
};