import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('techniques', ['name', 'type', 'grade', 'description']);

export { GET, POST };