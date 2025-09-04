import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('techniques');

export { GET, PUT, DELETE };