import { useAuthStore } from '~/stores/auth';

export function usePermissions() {
    const authStore = useAuthStore();
    const hasPermissions = authStore.user.role_users.roles.permissions;

    const availableGuards = [];
    
    hasPermissions.forEach(permission => {
        availableGuards.push(permission.guard_name);
    });

    return {
        availableGuards,
    };
}
