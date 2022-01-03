import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  imageLinksRecipe(ids: string[]): string[] {
    const DOMAIN = this.configService.get<string>('DOMAIN');
    return ids.map((id) => {
      return `${DOMAIN}/recipes/images/${id}`;
    });
  }
}
