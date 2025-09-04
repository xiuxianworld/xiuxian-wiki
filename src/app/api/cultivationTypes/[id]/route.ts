import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('cultivationTypes');

export { GET, PUT, DELETE };