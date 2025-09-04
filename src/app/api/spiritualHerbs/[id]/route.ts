import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('spiritualHerbs');

export { GET, PUT, DELETE };