import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('cultivationTypes', ['name', 'category', 'description']);

export { GET, POST };