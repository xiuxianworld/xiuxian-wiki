import { createCategoryRoute } from '@/lib/api-generator';

const { GET, POST } = createCategoryRoute('spiritualHerbs', ['name', 'type', 'grade', 'description']);

export { GET, POST };