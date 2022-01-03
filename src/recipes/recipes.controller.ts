import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CommonService } from '../common/common.service';
import { Recipe } from './models/recipe.model';
import { NewRecipeInput } from './dto/new-recipe.input';

// REST endpoints for recipes
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly commonService: CommonService,
  ) {}

  @Get(':id')
  async getRecipe(@Param('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe)
      throw new HttpException(
        `Recipe with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    recipe['images'] = this.commonService.imageLinksRecipe(recipe['images']);
    return recipe;
  }

  @Post()
  async createRecipe(@Body() createRecipeDto: NewRecipeInput): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<boolean> {
    return this.recipesService.remove(id);
  }
}
