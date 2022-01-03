import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './models/recipe.model';
import { Model } from 'mongoose';
import { NewRecipeInput } from './dto/new-recipe.input';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async findOne(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).lean();
  }

  async create(newRecipeData: NewRecipeInput): Promise<Recipe> {
    return this.recipeModel.create(newRecipeData);
  }

  async remove(id: string): Promise<boolean> {
    const removed = this.recipeModel.findByIdAndDelete(id).lean();
    return !!removed;
  }

  async updateOne(id: string, recipe: Recipe): Promise<Recipe> {
    return this.recipeModel.findByIdAndUpdate(id, recipe, { new: true }).lean();
  }
}
