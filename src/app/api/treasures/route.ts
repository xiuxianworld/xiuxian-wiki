import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('treasures', ['name', 'type', 'grade', 'description']);

export { GET, POST };