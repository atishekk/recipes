import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@ObjectType({ description: 'recipe' })
@Schema()
export class Recipe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => ID)
  _id: string;

  @Field()
  @Prop()
  title: string;

  @Field({ nullable: true })
  @Prop({ required: true })
  description?: string;

  @Field()
  @Prop({ type: Date, default: Date.now() })
  creationDate: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [String])
  @Prop([String])
  ingredients: string[];

  @Field((type) => [ID])
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Images' })
  images: string[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
