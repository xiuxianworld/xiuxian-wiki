import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('cultivationRealms', ['name', 'level', 'stage', 'description']);

export { GET, POST };