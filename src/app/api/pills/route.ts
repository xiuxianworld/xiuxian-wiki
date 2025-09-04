import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('pills', ['name', 'type', 'grade', 'description']);

export { GET, POST };