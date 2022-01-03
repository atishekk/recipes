import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongodb';

@Controller('recipes/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  async getImage(
    @Param('id') id: string,
    @Response({ passthrough: true }) res,
  ) {
    const image = await this.imagesService.getImageMetadata(new ObjectId(id));
    const imageStream = await this.imagesService.getImageStream(image._id);
    res.set({
      'Content-Type': image.contentType,
      'Content-Disposition': `inline; filename="${image.filename}"`,
    });
    return new StreamableFile(imageStream);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async uploadFile(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body('recipe_id') id: string,
  ) {
    return this.imagesService.uploadAndUpdate(images, id);
  }
}
