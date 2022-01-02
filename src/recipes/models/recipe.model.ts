import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

export type RecipeDocument = Recipe & Document;

@ObjectType({ description: 'recipe' })
@Schema()
export class Recipe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => ID)
  @Prop({ type: String, default: () => v4() })
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
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
