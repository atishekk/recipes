import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Recipe } from './models/recipe.model';
import { RecipesService } from './recipes.service';
import { NotFoundException } from '@nestjs/common';
import { NewRecipeInput } from './dto/new-recipe.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) throw new NotFoundException(id);
    return recipe;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Recipe)
  async addRecipe(
    @Args('newRecipeData') newRecipeData: NewRecipeInput,
  ): Promise<Recipe> {
    const recipe = await this.recipesService.create(newRecipeData);
    await pubSub.publish('recipeAdded', { recipeAdded: recipe });
    return recipe;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Boolean)
  async removeRecipe(@Args('id') id: string) {
    return this.recipesService.remove(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Subscription((returns) => Recipe)
  recipeAdded() {
    return pubSub.asyncIterator('recipeAdded');
  }
}
