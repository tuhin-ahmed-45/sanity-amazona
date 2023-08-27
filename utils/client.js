import { createClient } from '@sanity/client';
import config from './config';
const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  useCdn: false,
});
export default client;