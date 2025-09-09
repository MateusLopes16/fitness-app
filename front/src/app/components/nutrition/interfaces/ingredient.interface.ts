export interface Ingredient {
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

export interface CreateIngredientDto {
  name: string;
  brand?: string;
  barcode?: string;
  caloriesPer100g: string;
  proteinPer100g: string;
  carbsPer100g: string;
  fatPer100g: string;
  fiberPer100g?: string;
  sugarPer100g?: string;
  sodiumPer100g?: string;
}

export interface UpdateIngredientDto extends Partial<CreateIngredientDto> {}
