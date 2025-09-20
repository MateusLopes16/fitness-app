import { IsString, IsOptional, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { IngredientTag } from '../../../common/enums/ingredient-tag.enum';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(IngredientTag)
  tag: IngredientTag;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  caloriesPer100g: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  proteinPer100g: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  carbsPer100g: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  fatPer100g: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  fiberPer100g?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  sugarPer100g?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  sodiumPer100g?: number;
}
