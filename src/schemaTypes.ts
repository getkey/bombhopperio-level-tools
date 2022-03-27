import { JTDDataType } from 'ajv/dist/jtd';

import levelSchema from './level.schema.json';
import entitySchema from './entity.schema.json';
import prefabSchema from './prefab.schema.json';

export type Level = JTDDataType<typeof levelSchema>;
export type Entity = JTDDataType<typeof entitySchema>;
export type Prefab = JTDDataType<typeof prefabSchema>;
