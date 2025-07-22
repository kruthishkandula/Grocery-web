export const NODE_URLS = {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    dashboard_details: '/api/admin/dashboard/details',
}

export const CMS_URLS = {
    products: '/products', // post- create, get, update, delete
    product: (id: string) => `/products/${id}`, // get, update,
    categories: '/categories', // post- create, get, update, delete
    category: (id: string) => `/categories/${id}`, // get, update,
}