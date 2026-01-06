import { defineSchema } from 'convex/server';
import * as tables from './tables';

const schema = defineSchema({
  ...tables,
});

export default schema;
