import { Ingredient as PrismaIngredient } from '@prisma/client';

export class Ingredient implements PrismaIngredient {
  id: string;
  name: string;
  brand: string | null;
  barcode: string | null;
  caloriesPer100g: any; // Decimal from Prisma
  proteinPer100g: any;
  carbsPer100g: any;
  fatPer100g: any;
  fiberPer100g: any | null;
  sugarPer100g: any | null;
  sodiumPer100g: any | null;
  createdBy: string | null;
  createdAt: Date;
}
