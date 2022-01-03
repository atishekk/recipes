import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './models/recipe.model';
import { RecipesResolver } from './recipes.resolver';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { ImagesController } from './images/images.controller';
import { CommonModule } from '../common/common.module';
import { ImagesService } from './images/images.service';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
    CommonModule,
    ConfigModule,
    MulterModule.registerAsync({
      imports: [RecipesModule],
      useFactory: async (imageService: ImagesService) => {
        return imageService.multerImageFactory();
      },
      inject: [ImagesService],
    }),
  ],
  providers: [RecipesResolver, RecipesService, ImagesService],
  controllers: [RecipesController, ImagesController],
  exports: [ImagesService],
})
export class RecipesModule {}
