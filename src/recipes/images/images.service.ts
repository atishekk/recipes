import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSFile,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { RecipesService } from '../recipes.service';
import { CommonService } from '../../common/common.service';
import { Recipe } from '../models/recipe.model';
import { GridFsStorage } from 'multer-gridfs-storage';
import * as path from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class ImagesService {
  private connection: MongoClient;
  private GridFS: GridFSBucket;

  constructor(
    private readonly configService: ConfigService,
    private readonly recipesService: RecipesService,
    private readonly commonService: CommonService,
  ) {
    const URI = this.configService.get<string>('URI');
    const bucketName = this.configService.get<string>('BUCKET');
    MongoClient.connect(URI).then((client) => {
      this.connection = client;
      this.GridFS = new GridFSBucket(
        client.db(this.configService.get<string>('DB')),
        { bucketName },
      );
    });
  }

  async uploadAndUpdate(
    images: Array<Express.Multer.File>,
    id: string,
  ): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(id);
    const image_ids = images.map((image) => image['id'].toString());
    if (!recipe['images']) recipe.images = image_ids;
    else recipe['images'].push(...image_ids);
    const updated = await this.recipesService.updateOne(id, recipe);
    updated.images = this.commonService.imageLinksRecipe(updated.images);
    return updated;
  }

  async getImageMetadata(id: ObjectId): Promise<GridFSFile> {
    const files = await this.GridFS.find({ _id: id }).toArray();
    if (!files[0]) {
      Logger.error(
        `File Not Found id: ${id}, status-code: ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('File Not Found.', HttpStatus.NOT_FOUND);
    }
    return files[0];
  }

  async getImageStream(id: ObjectId): Promise<GridFSBucketReadStream> {
    return this.GridFS.openDownloadStream(id);
  }

  multerImageFactory(): MulterOptions {
    return {
      storage: new GridFsStorage({
        url: this.configService.get<string>('DB_URI'),
        file: (_, file) => {
          return Promise.resolve({
            filename: path.parse(file.originalname).name,
            bucketName: this.configService.get<string>('BUCKET'),
          });
        },
      }),
      fileFilter: async (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        const recipe = await this.recipesService.findOne(req.body.recipe_id);
        if (!recipe)
          return callback(
            new HttpException(`Invalid Recipe`, HttpStatus.NOT_FOUND),
            false,
          );
        callback(null, true);
      },
    };
  }
}
