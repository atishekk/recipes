import { Recipe } from '../models/recipe.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'paginated recipes' })
export class PaginatedRecipe {
  @Field((type) => ID, { nullable: true })
  cursor?: string;

  @Field((type) => Boolean, { nullable: true })
  hasNext?: boolean;

  @Field((type) => [Recipe], { nullable: true })
  recipes?: Recipe[];
}
