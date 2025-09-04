import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('spiritualBeasts');

export { GET, PUT, DELETE };