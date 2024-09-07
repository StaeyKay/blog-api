export const roles = [
    {
        role: 'superadmin',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_user',
            'read_users',
            'update_user',
            'delete_user',
            'create_article',
            'update_article',
            'delete_article'
        ]
    },
    {
        role: 'admin',
        permissions: [
            'update_profile',
            'delete_profile',
            'read_users',
            'update_user',
            'create_article',
            'update_article'
        ]
    },
    {
        role: 'manager',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_article'
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_profile',
            'delete_profile'
        ]
    }
]