import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('formations', ['name', 'type', 'grade', 'description']);

export { GET, POST };