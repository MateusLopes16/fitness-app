import { IngredientTag } from '../../../common/enums/ingredient-tag.enum';

export class IngredientDto {
  id: string;
  name: string;
  imageUrl?: string;
  tag: IngredientTag;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number;
  createdBy?: string;
  createdByType: 'admin' | 'user';
  createdAt: Date;
}
