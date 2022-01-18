import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Recipe } from './models/recipe.model';
import { RecipesService } from './recipes.service';
import { NotFoundException } from '@nestjs/common';
import { RecipeMetaInput } from './dto/recipe-meta.input';
import { PubSub } from 'graphql-subscriptions';
import { CommonService } from '../common/common.service';
import { PaginatedRecipe } from './dto/paginated-recipe';

const pubSub = new PubSub();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => Recipe)
export class RecipesResolver {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly commonService: CommonService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) throw new NotFoundException(id);
    recipe['images'] = this.commonService.imageLinksRecipe(recipe['images']);
    return recipe;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => PaginatedRecipe)
  async paginateRecipe(@Args('cursor', { nullable: true }) cursor: string) {
    return this.recipesService.paginateRecipe(cursor, 10);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Recipe)
  async updateRecipe(
    @Args('id') id: string,
    @Args('updatedRecipe') updatedRecipe: RecipeMetaInput,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updatedRecipe);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Recipe)
  async addRecipe(
    @Args('newRecipeData') newRecipeData: RecipeMetaInput,
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
