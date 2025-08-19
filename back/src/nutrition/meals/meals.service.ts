import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealDto } from './dto/meal.dto';
import { MealType } from '@prisma/client';

@Injectable()
export class MealsService {
  constructor(private database: DatabaseService) {}

  async create(createMealDto: CreateMealDto, userId?: string): Promise<MealDto> {
    const { ingredients, ...mealData } = createMealDto;

    // Create meal with ingredients in a transaction
    const meal = await this.database.$transaction(async (prisma) => {
      // Create the meal
      const createdMeal = await prisma.meal.create({
        data: {
          name: createMealDto.name,
          description: createMealDto.description,
          recipe: createMealDto.recipe,
          ...(createMealDto.mealType && { mealType: createMealDto.mealType }),
          ...(createMealDto.date && { date: new Date(createMealDto.date) }),
          userId: userId || null,
        } as any,
      });

      // Create meal ingredients
      await prisma.mealIngredient.createMany({
        data: ingredients.map(ingredient => ({
          mealId: createdMeal.id,
          ingredientId: ingredient.ingredientId,
          quantityGrams: parseFloat(ingredient.quantityGrams),
        })),
      });

      return createdMeal;
    });

    return this.findOne(meal.id, userId || 'admin');
  }

  async findAll(userId: string, mealType?: MealType): Promise<MealDto[]> {
    const meals = await this.database.meal.findMany({
      where: mealType ? { mealType } : {},
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return meals.map(meal => this.mapToDto(meal));
  }

  async findOne(id: string, userId: string): Promise<MealDto> {
    const meal = await this.database.meal.findFirst({
      where: {
        id,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return this.mapToDto(meal);
  }

  async findUserMealsByDate(userId: string, date: string): Promise<MealDto[]> {
    const meals = await this.database.meal.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        mealType: 'asc',
      },
    });

    return meals.map(meal => this.mapToDto(meal));
  }

  async update(id: string, updateMealDto: UpdateMealDto, userId: string): Promise<MealDto> {
    // Check if user can update this meal
    const existingMeal = await this.database.meal.findFirst({
      where: {
        id,
      },
    });

    if (!existingMeal) {
      throw new NotFoundException('Meal not found or you do not have permission to update it');
    }

    const { ingredients, ...mealData } = updateMealDto;

    const updatedMeal = await this.database.$transaction(async (prisma) => {
      // Update meal data
      const meal = await prisma.meal.update({
        where: { id },
        data: {
          ...mealData,
          date: updateMealDto.date ? new Date(updateMealDto.date) : undefined,
        },
      });

      // If ingredients are provided, replace all existing ingredients
      if (ingredients) {
        // Delete existing ingredients
        await prisma.mealIngredient.deleteMany({
          where: { mealId: id },
        });

        // Create new ingredients
        await prisma.mealIngredient.createMany({
          data: ingredients.map(ingredient => ({
            mealId: id,
            ingredientId: ingredient.ingredientId,
            quantityGrams: parseFloat(ingredient.quantityGrams),
          })),
        });
      }

      return meal;
    });

    return this.findOne(updatedMeal.id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if user can delete this meal
    const meal = await this.database.meal.findFirst({
      where: {
        id,
      },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found or you do not have permission to delete it');
    }

    await this.database.meal.delete({
      where: { id },
    });
  }

  async duplicateAsPersonal(id: string, userId: string, mealType?: MealType, date?: string): Promise<MealDto> {
    const originalMeal = await this.findOne(id, userId);

    const createMealDto: CreateMealDto = {
      name: originalMeal.name,
      description: originalMeal.description,
      recipe: originalMeal.recipe,
      mealType: mealType || originalMeal.mealType,
      date: date,
      servings: originalMeal.servings,
      ingredients: originalMeal.ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        quantityGrams: ing.quantityGrams.toString(),
      })),
    };

    return this.create(createMealDto, userId);
  }

  private mapToDto(meal: any): MealDto {
    // Calculate total nutritional values
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    const mappedIngredients = meal.ingredients.map(mealIngredient => {
      const quantity = parseFloat(mealIngredient.quantityGrams.toString());
      const ingredient = mealIngredient.ingredient;
      
      // Calculate nutritional values for this ingredient
      const multiplier = quantity / 100; // Convert from per 100g to actual quantity
      
      totalCalories += parseFloat(ingredient.caloriesPer100g.toString()) * multiplier;
      totalProtein += parseFloat(ingredient.proteinPer100g.toString()) * multiplier;
      totalCarbs += parseFloat(ingredient.carbsPer100g.toString()) * multiplier;
      totalFat += parseFloat(ingredient.fatPer100g.toString()) * multiplier;
      
      if (ingredient.fiberPer100g) {
        totalFiber += parseFloat(ingredient.fiberPer100g.toString()) * multiplier;
      }
      if (ingredient.sugarPer100g) {
        totalSugar += parseFloat(ingredient.sugarPer100g.toString()) * multiplier;
      }
      if (ingredient.sodiumPer100g) {
        totalSodium += parseFloat(ingredient.sodiumPer100g.toString()) * multiplier;
      }

      return {
        id: mealIngredient.id,
        ingredientId: ingredient.id,
        quantityGrams: quantity,
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          brand: ingredient.brand,
          caloriesPer100g: parseFloat(ingredient.caloriesPer100g.toString()),
          proteinPer100g: parseFloat(ingredient.proteinPer100g.toString()),
          carbsPer100g: parseFloat(ingredient.carbsPer100g.toString()),
          fatPer100g: parseFloat(ingredient.fatPer100g.toString()),
          fiberPer100g: ingredient.fiberPer100g ? parseFloat(ingredient.fiberPer100g.toString()) : undefined,
          sugarPer100g: ingredient.sugarPer100g ? parseFloat(ingredient.sugarPer100g.toString()) : undefined,
          sodiumPer100g: ingredient.sodiumPer100g ? parseFloat(ingredient.sodiumPer100g.toString()) : undefined,
        },
      };
    });

    return {
      id: meal.id,
      name: meal.name,
      description: meal.description,
      recipe: meal.recipe,
      mealType: meal.mealType,
      date: meal.date ? meal.date.toISOString().split('T')[0] : undefined,
      servings: meal.servings,
      createdByType: meal.userId ? 'user' : 'admin',
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt,
      ingredients: mappedIngredients,
      totalCalories: Math.round(totalCalories * 100) / 100,
      totalProtein: Math.round(totalProtein * 100) / 100,
      totalCarbs: Math.round(totalCarbs * 100) / 100,
      totalFat: Math.round(totalFat * 100) / 100,
      totalFiber: totalFiber > 0 ? Math.round(totalFiber * 100) / 100 : undefined,
      totalSugar: totalSugar > 0 ? Math.round(totalSugar * 100) / 100 : undefined,
      totalSodium: totalSodium > 0 ? Math.round(totalSodium * 100) / 100 : undefined,
    };
  }
}
