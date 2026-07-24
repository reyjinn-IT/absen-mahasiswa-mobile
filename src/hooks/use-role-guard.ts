import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/services/auth';

export function useRoleGuard(requiredRole: User['role']) {
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
        router.replace('/login');
        return;
        }

        if (user.role === requiredRole) return;

        if (user.role === 'admin') {
        router.replace('/(admin)/dashboard');
        } else if (user.role === 'dosen') {
        router.replace('/(dosen)/dashboard');
        } else {
        router.replace('/(mahasiswa)/dashboard');
        }
    }, [isLoading, isAuthenticated, user, requiredRole]);

    const isAllowed = !isLoading && isAuthenticated && user?.role === requiredRole;
    return { isAllowed, isLoading };
}