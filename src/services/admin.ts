import { api } from './api';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  nim?: string;
  nidn?: string;
}

export interface Matakuliah {
  id: number;
  nama: string;
  kode: string;
  sks: number;
  dosen_id?: number;
  dosen?: AdminUser;
}

export interface Kelas {
  id: number;
  nama: string;
  matakuliah_id: number;
  dosen_id: number;
  matakuliah?: Matakuliah;
  dosen?: AdminUser;
  mahasiswa?: AdminUser[];
  mahasiswa_count?: number;
}

export interface DashboardStats {
  total_users: number;
  total_mahasiswa: number;
  total_dosen: number;
  total_matakuliah: number;
  total_kelas: number;
  total_absensi_hari_ini: number;
}

export interface LaporanFilter {
  start_date?: string;
  end_date?: string;
  kelas_id?: string;
}

export const adminService = {
  getUsers(role?: string): Promise<AdminUser[]> {
    const query = role ? `?role=${role}` : '';
    return api.get<AdminUser[]>(`/admin/users${query}`);
  },

  createUser(payload: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    return api.post<AdminUser>('/admin/users', payload);
  },

  updateUser(id: number, payload: Partial<AdminUser>): Promise<AdminUser> {
    return api.put<AdminUser>(`/admin/users/${id}`, payload);
  },

  deleteUser(id: number): Promise<void> {
    return api.delete(`/admin/users/${id}`);
  },

  getMatakuliah(): Promise<Matakuliah[]> {
    return api.get<Matakuliah[]>('/admin/matakuliah');
  },

  getMatakuliahDetail(id: number): Promise<Matakuliah> {
    return api.get<Matakuliah>(`/admin/matakuliah/${id}`);
  },

  createMatakuliah(payload: Partial<Matakuliah>): Promise<Matakuliah> {
    return api.post<Matakuliah>('/admin/matakuliah', payload);
  },

  updateMatakuliah(id: number, payload: Partial<Matakuliah>): Promise<Matakuliah> {
    return api.put<Matakuliah>(`/admin/matakuliah/${id}`, payload);
  },

  deleteMatakuliah(id: number): Promise<void> {
    return api.delete(`/admin/matakuliah/${id}`);
  },

  getKelas(): Promise<Kelas[]> {
    return api.get<Kelas[]>('/admin/kelas');
  },

  createKelas(payload: Partial<Kelas>): Promise<Kelas> {
    return api.post<Kelas>('/admin/kelas', payload);
  },

  updateKelas(id: number, payload: Partial<Kelas>): Promise<Kelas> {
    return api.put<Kelas>(`/admin/kelas/${id}`, payload);
  },

  deleteKelas(id: number): Promise<void> {
    return api.delete(`/admin/kelas/${id}`);
  },

  addMahasiswaToKelas(kelasId: number, mahasiswaIds: number[]): Promise<void> {
    return api.post(`/admin/kelas/${kelasId}/mahasiswa`, { mahasiswa_ids: mahasiswaIds });
  },

  getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/admin/dashboard');
  },

  getLaporanAbsensi(filter?: LaporanFilter): Promise<unknown> {
    const params = new URLSearchParams();
    if (filter?.start_date) params.append('start_date', filter.start_date);
    if (filter?.end_date) params.append('end_date', filter.end_date);
    if (filter?.kelas_id) params.append('kelas_id', filter.kelas_id);
    const query = params.toString();
    return api.get(`/admin/laporan-absensi${query ? `?${query}` : ''}`);
  },
};