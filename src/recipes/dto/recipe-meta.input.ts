import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class RecipeMetaInput {
  @Field()
  @MaxLength(30)
  @ApiProperty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  @ApiProperty()
  description?: string;

  @Field((type) => [String])
  @ApiProperty()
  ingredients: string[];
}
