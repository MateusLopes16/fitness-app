export class IngredientDto {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
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
