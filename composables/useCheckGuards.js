export default function useCheckGuards() {
    const checkGuards = (guardName, guardActions) => {
        const { availableGuards } = usePermissions();
        
        const permissions = [];

        guardActions.forEach((action) => {
            const guard = `${guardName}_${action}`;
            permissions[action] = ref(availableGuards.includes(guard));
        });

        return permissions;
    };

    return {
        checkGuards,
    };
}
