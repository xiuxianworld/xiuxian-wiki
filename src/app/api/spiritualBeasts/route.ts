import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('spiritualBeasts', ['name', 'species', 'level', 'description']);

export { GET, POST };