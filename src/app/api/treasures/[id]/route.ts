import { createItemRoute } from '@/lib/api-generator';

const { GET, PUT, DELETE } = createItemRoute('treasures');

export { GET, PUT, DELETE };