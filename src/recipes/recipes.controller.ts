import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CommonService } from '../common/common.service';
import { Recipe } from './models/recipe.model';
import { RecipeMetaInput } from './dto/recipe-meta.input';
import { PaginatedRecipe } from './dto/paginated-recipe';
import { ApiQuery } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'cursor', required: false })
  async getPaginatedRecipes(
    @Query('cursor') cursor?: string,
  ): Promise<PaginatedRecipe> {
    return this.recipesService.paginateRecipe(cursor, 10);
  }

  @Post()
  async createRecipe(
    @Body() createRecipeDto: RecipeMetaInput,
  ): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') id: string): Promise<boolean> {
    return this.recipesService.remove(id);
  }

  @Put(':id')
  async updateRecipeMeta(
    @Param('id') id: string,
    @Body() updatedRecipe: RecipeMetaInput,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updatedRecipe);
  }
}
