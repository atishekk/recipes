import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './models/recipe.model';
import { Model } from 'mongoose';
import { RecipeMetaInput } from './dto/recipe-meta.input';
import { PaginatedRecipe } from './dto/paginated-recipe';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findOne(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).lean();
  }

  async create(newRecipeData: RecipeMetaInput): Promise<Recipe> {
    return this.recipeModel.create(newRecipeData);
  }

  async remove(id: string): Promise<boolean> {
    const removed = this.recipeModel.findByIdAndDelete(id).lean();
    return !!removed;
  }

  async updateOne(id: string, recipe: Recipe): Promise<Recipe> {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).lean();
  }

  async paginateRecipe(
    cursor: string,
    limit: number,
  ): Promise<PaginatedRecipe> {
    let hasNextPage = false;

    const cursorQuery = cursor ? { _id: { $lt: cursor } } : {};

    let recipes = await this.recipeModel
      .find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (recipes.length > limit) {
      hasNextPage = true;
      recipes = recipes.slice(0, -1);
    }
    const newCursor = recipes[recipes.length - 1]._id;
    return {
      recipes,
      cursor: newCursor,
      hasNext: hasNextPage,
    };
  }

  async update(id: string, updatedRecipe: RecipeMetaInput): Promise<Recipe> {
    return this.recipeModel
      .findOneAndUpdate({ _id: id }, updatedRecipe, {
        new: true,
      })
      .lean();
  }
}
