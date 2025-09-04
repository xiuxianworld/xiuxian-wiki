import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('cultivationRealms');

export { GET, PUT, DELETE };