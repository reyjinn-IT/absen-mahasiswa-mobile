import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing, Radius } from '@/constants/theme';
import { adminService, type AdminUser } from '@/services/admin';
import { useTheme } from '@/hooks/use-theme';

export default function AdminUsersScreen() {
  const theme = useTheme();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('mahasiswa');
  const [formNim, setFormNim] = useState('');
  const [formNidn, setFormNidn] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminService.getUsers(roleFilter || undefined);
      setUsers(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('mahasiswa');
    setFormNim('');
    setFormNidn('');
    setModalVisible(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormNim(u.nim ?? '');
    setFormNidn(u.nidn ?? '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formName || !formEmail) return;
    setSaving(true);
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, {
          name: formName,
          email: formEmail,
          role: formRole,
          nim: formRole === 'mahasiswa' ? formNim : undefined,
          nidn: formRole === 'dosen' ? formNidn : undefined,
        });
      } else {
        await adminService.createUser({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          nim: formRole === 'mahasiswa' ? formNim : undefined,
          nidn: formRole === 'dosen' ? formNidn : undefined,
        });
      }
      setModalVisible(false);
      fetchUsers();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Gagal menyimpan';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Hapus User', `Yakin hapus "${name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminService.deleteUser(id);
            fetchUsers();
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Gagal menghapus';
            Alert.alert('Error', msg);
          }
        },
      },
    ]);
  };

  const roleBadgeColor = (role: string) => {
    if (role === 'admin') return '#FF2D55';
    if (role === 'dosen') return '#FF9500';
    return '#34C759';
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} />
          }>
          <ThemedView style={styles.header}>
            <ThemedView style={styles.headerRow}>
              <ThemedText type="title" style={styles.pageTitle}>
                Users
              </ThemedText>
              <Button title="+ Tambah" size="sm" onPress={openCreate} />
            </ThemedView>

            <ThemedView style={styles.filterRow}>
              {['', 'admin', 'dosen', 'mahasiswa'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.filterChip,
                    { backgroundColor: roleFilter === r ? theme.tint : theme.backgroundElement },
                  ]}
                  onPress={() => setRoleFilter(r)}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: roleFilter === r ? '#FFF' : theme.text }}>
                    {r || 'Semua'}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : users.length === 0 ? (
            <EmptyState title="Tidak ada user" message="Belum ada data user tersedia" />
          ) : (
            <ThemedView style={styles.list}>
              {users.map((u) => (
                <Card key={u.id} style={styles.userCard}>
                  <ThemedView style={styles.userInfo}>
                    <ThemedView style={styles.userAvatar}>
                      <ThemedText style={styles.avatarText}>
                        {u.name.charAt(0).toUpperCase()}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.userDetail}>
                      <ThemedText style={styles.userName}>{u.name}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {u.email}
                      </ThemedText>
                      <ThemedView style={styles.userMeta}>
                        <ThemedView
                          style={[styles.roleBadge, { backgroundColor: roleBadgeColor(u.role) + '20' }]}>
                          <ThemedText
                            type="smallBold"
                            style={{ color: roleBadgeColor(u.role), fontSize: 11 }}>
                            {u.role.toUpperCase()}
                          </ThemedText>
                        </ThemedView>
                        {u.nim && (
                          <ThemedText type="small" themeColor="textSecondary">
                            NIM: {u.nim}
                          </ThemedText>
                        )}
                        {u.nidn && (
                          <ThemedText type="small" themeColor="textSecondary">
                            NIDN: {u.nidn}
                          </ThemedText>
                        )}
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.userActions}>
                    <TouchableOpacity onPress={() => openEdit(u)}>
                      <ThemedText themeColor="tint" type="smallBold">
                        Edit
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(u.id, u.name)}>
                      <ThemedText themeColor="destructive" type="smallBold">
                        Hapus
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </Card>
              ))}
            </ThemedView>
          )}
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <ThemedView style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <ThemedText themeColor="tint">Batal</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  {editingUser ? 'Edit User' : 'Tambah User'}
                </ThemedText>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                  <ThemedText themeColor="tint" style={{ fontWeight: '600' }}>
                    {saving ? '...' : 'Simpan'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={styles.form}>
                <Input label="Nama" value={formName} onChangeText={setFormName} placeholder="Nama lengkap" />
                <Input label="Email" value={formEmail} onChangeText={setFormEmail} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" />
                {!editingUser && (
                  <Input label="Password" value={formPassword} onChangeText={setFormPassword} placeholder="Minimal 8 karakter" secureTextEntry />
                )}

                <ThemedView style={styles.roleSelector}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.label}>
                    ROLE
                  </ThemedText>
                  <ThemedView style={styles.roleRow}>
                    {['admin', 'dosen', 'mahasiswa'].map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[
                          styles.roleOption,
                          {
                            backgroundColor: formRole === r ? theme.tint : theme.backgroundElement,
                          },
                        ]}
                        onPress={() => setFormRole(r)}>
                        <ThemedText
                          type="smallBold"
                          style={{ color: formRole === r ? '#FFF' : theme.text }}>
                          {r}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </ThemedView>

                {formRole === 'mahasiswa' && (
                  <Input label="NIM" value={formNim} onChangeText={setFormNim} placeholder="Nomor Induk Mahasiswa" />
                )}
                {formRole === 'dosen' && (
                  <Input label="NIDN" value={formNidn} onChangeText={setFormNidn} placeholder="Nomor Induk Dosen Nasional" />
                )}
              </ThemedView>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.four, paddingBottom: Spacing.six * 2 },
  header: { gap: Spacing.three },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 32, lineHeight: 40 },
  filterRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  list: { gap: Spacing.two },
  userCard: { gap: Spacing.three },
  userInfo: { flexDirection: 'row', gap: Spacing.three },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#007AFF20', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  userDetail: { flex: 1, gap: 2 },
  userName: { fontSize: 16, fontWeight: '600' },
  userMeta: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  userActions: { flexDirection: 'row', gap: Spacing.four, marginTop: Spacing.one },
  modalContainer: { flex: 1 },
  modalScroll: { padding: Spacing.four, gap: Spacing.four },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20 },
  form: { gap: Spacing.three },
  label: { textTransform: 'uppercase', letterSpacing: 0.5 },
  roleSelector: { gap: 6 },
  roleRow: { flexDirection: 'row', gap: Spacing.two },
  roleOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md, flex: 1, alignItems: 'center' },
});