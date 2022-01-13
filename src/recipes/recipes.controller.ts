import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CommonService } from '../common/common.service';
import { Recipe } from './models/recipe.model';
import { NewRecipeInput } from './dto/new-recipe.input';
import { PaginatedRecipe } from './dto/paginated-recipe';

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

  @Get()
  async getPaginatedRecipes(
    @Query('cursor') cursor: string,
  ): Promise<PaginatedRecipe> {
    return this.recipesService.paginateRecipe(cursor, 10);
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
