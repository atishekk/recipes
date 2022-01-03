import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const ImagesMetadata = mongoose.model(
  'Images',
  new Schema({}, { strict: false }),
  'images.files',
);
