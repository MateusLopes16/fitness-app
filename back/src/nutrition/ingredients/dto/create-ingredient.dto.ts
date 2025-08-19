import { IsString, IsOptional, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

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
