import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMealScheduleDto, UpdateMealScheduleDto, MealScheduleQueryDto } from './dto/meal-schedule.dto';
import { MealSchedule } from './interfaces/meal-schedule.interface';

@Injectable()
export class MealScheduleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMealSchedule(userId: string, createMealScheduleDto: CreateMealScheduleDto): Promise<MealSchedule> {
    const { mealId, date, mealType, notes } = createMealScheduleDto;

    // Check if meal exists
    const meal = await this.databaseService.meal.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    // Check if schedule already exists for this user, date, and meal type
    const existingSchedule = await this.databaseService.mealSchedule.findFirst({
      where: {
        userId,
        date: new Date(date),
        mealType,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Meal schedule already exists for this date and meal type');
    }

    const mealSchedule = await this.databaseService.mealSchedule.create({
      data: {
        userId,
        mealId,
        date: new Date(date),
        mealType,
        notes,
      },
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    return this.transformMealSchedule(mealSchedule);
  }

  async getMealSchedules(userId: string, query: MealScheduleQueryDto): Promise<MealSchedule[]> {
    const where: any = { userId };

    if (query.date) {
      where.date = new Date(query.date);
    } else if (query.startDate && query.endDate) {
      where.date = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    } else if (query.startDate) {
      where.date = {
        gte: new Date(query.startDate),
      };
    } else if (query.endDate) {
      where.date = {
        lte: new Date(query.endDate),
      };
    }

    if (query.mealType) {
      where.mealType = query.mealType;
    }

    if (query.completed !== undefined) {
      where.completed = query.completed;
    }

    const mealSchedules = await this.databaseService.mealSchedule.findMany({
      where,
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { mealType: 'asc' },
      ],
    });

    return mealSchedules.map(this.transformMealSchedule);
  }

  async getMealSchedule(userId: string, scheduleId: string): Promise<MealSchedule> {
    const mealSchedule = await this.databaseService.mealSchedule.findFirst({
      where: {
        id: scheduleId,
        userId,
      },
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    if (!mealSchedule) {
      throw new NotFoundException('Meal schedule not found');
    }

    return this.transformMealSchedule(mealSchedule);
  }

  async updateMealSchedule(
    userId: string,
    scheduleId: string,
    updateMealScheduleDto: UpdateMealScheduleDto,
  ): Promise<MealSchedule> {
    const existingSchedule = await this.databaseService.mealSchedule.findFirst({
      where: {
        id: scheduleId,
        userId,
      },
    });

    if (!existingSchedule) {
      throw new NotFoundException('Meal schedule not found');
    }

    const updateData: any = {};

    if (updateMealScheduleDto.mealId) {
      // Check if meal exists
      const meal = await this.databaseService.meal.findUnique({
        where: { id: updateMealScheduleDto.mealId },
      });

      if (!meal) {
        throw new NotFoundException('Meal not found');
      }

      updateData.mealId = updateMealScheduleDto.mealId;
    }

    if (updateMealScheduleDto.date) {
      updateData.date = new Date(updateMealScheduleDto.date);
    }

    if (updateMealScheduleDto.mealType) {
      updateData.mealType = updateMealScheduleDto.mealType;
    }

    if (updateMealScheduleDto.completed !== undefined) {
      updateData.completed = updateMealScheduleDto.completed;
    }

    if (updateMealScheduleDto.notes !== undefined) {
      updateData.notes = updateMealScheduleDto.notes;
    }

    // Check for conflicts if date or mealType is being updated
    if (updateData.date || updateData.mealType) {
      const conflictDate = updateData.date || existingSchedule.date;
      const conflictMealType = updateData.mealType || existingSchedule.mealType;

      const conflictingSchedule = await this.databaseService.mealSchedule.findFirst({
        where: {
          userId,
          date: conflictDate,
          mealType: conflictMealType,
          id: { not: scheduleId },
        },
      });

      if (conflictingSchedule) {
        throw new BadRequestException('Meal schedule already exists for this date and meal type');
      }
    }

    const mealSchedule = await this.databaseService.mealSchedule.update({
      where: { id: scheduleId },
      data: updateData,
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    return this.transformMealSchedule(mealSchedule);
  }

  async deleteMealSchedule(userId: string, scheduleId: string): Promise<void> {
    const mealSchedule = await this.databaseService.mealSchedule.findFirst({
      where: {
        id: scheduleId,
        userId,
      },
    });

    if (!mealSchedule) {
      throw new NotFoundException('Meal schedule not found');
    }

    await this.databaseService.mealSchedule.delete({
      where: { id: scheduleId },
    });
  }

  async getWeekSchedule(userId: string, date: string): Promise<any> {
    const selectedDate = new Date(date);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const schedules = await this.databaseService.mealSchedule.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { mealType: 'asc' },
      ],
    });

    // Group by date
    const weekSchedule: any[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const daySchedules = schedules
        .filter(s => s.date.toISOString().split('T')[0] === dateStr)
        .map(this.transformMealSchedule);

      const dayNutrition = this.calculateDayNutrition(daySchedules);

      weekSchedule.push({
        date: dateStr,
        dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        schedules: daySchedules,
        nutrition: dayNutrition,
      });
    }

    return weekSchedule;
  }

  async planWeek(userId: string, weekPlanDto: any): Promise<void> {
    const { startDate, mealPlans } = weekPlanDto;
    
    // Delete existing schedules for the week
    const startOfWeek = new Date(startDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    await this.databaseService.mealSchedule.deleteMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // Create new schedules
    const schedules: any[] = [];
    for (const plan of mealPlans) {
      schedules.push({
        userId,
        mealId: plan.mealId,
        date: new Date(plan.date),
        mealType: plan.mealType,
        notes: plan.notes || null,
      });
    }

    if (schedules.length > 0) {
      await this.databaseService.mealSchedule.createMany({
        data: schedules,
      });
    }
  }

  async getDailyNutrition(userId: string, date: string): Promise<any> {
    const schedules = await this.databaseService.mealSchedule.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });

    const transformedSchedules = schedules.map(this.transformMealSchedule);
    return this.calculateDayNutrition(transformedSchedules);
  }

  private calculateDayNutrition(schedules: MealSchedule[]): any {
    return {
      totalCalories: schedules.reduce((total, schedule) => total + (schedule.meal.totalCalories || 0), 0),
      totalProtein: schedules.reduce((total, schedule) => total + (schedule.meal.totalProtein || 0), 0),
      totalCarbs: schedules.reduce((total, schedule) => total + (schedule.meal.totalCarbs || 0), 0),
      totalFat: schedules.reduce((total, schedule) => total + (schedule.meal.totalFat || 0), 0),
      totalFiber: schedules.reduce((total, schedule) => total + (schedule.meal.totalFiber || 0), 0),
      totalSugar: schedules.reduce((total, schedule) => total + (schedule.meal.totalSugar || 0), 0),
      totalSodium: schedules.reduce((total, schedule) => total + (schedule.meal.totalSodium || 0), 0),
      mealsCount: schedules.length,
      completedMeals: schedules.filter(s => s.completed).length,
    };
  }

  private transformMealSchedule(mealSchedule: any): MealSchedule {
    const totalCalories = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      return total + (Number(ingredient.ingredient.caloriesPer100g) * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalProtein = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      return total + (Number(ingredient.ingredient.proteinPer100g) * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalCarbs = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      return total + (Number(ingredient.ingredient.carbsPer100g) * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalFat = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      return total + (Number(ingredient.ingredient.fatPer100g) * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalFiber = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      const fiber = ingredient.ingredient.fiberPer100g ? Number(ingredient.ingredient.fiberPer100g) : 0;
      return total + (fiber * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalSugar = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      const sugar = ingredient.ingredient.sugarPer100g ? Number(ingredient.ingredient.sugarPer100g) : 0;
      return total + (sugar * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    const totalSodium = mealSchedule.meal.ingredients.reduce((total: number, ingredient: any) => {
      const sodium = ingredient.ingredient.sodiumPer100g ? Number(ingredient.ingredient.sodiumPer100g) : 0;
      return total + (sodium * Number(ingredient.quantityGrams)) / 100;
    }, 0);

    return {
      id: mealSchedule.id,
      userId: mealSchedule.userId,
      mealId: mealSchedule.mealId,
      date: mealSchedule.date.toISOString().split('T')[0],
      mealType: mealSchedule.mealType,
      completed: mealSchedule.completed,
      notes: mealSchedule.notes,
      createdAt: mealSchedule.createdAt,
      updatedAt: mealSchedule.updatedAt,
      meal: {
        id: mealSchedule.meal.id,
        name: mealSchedule.meal.name,
        description: mealSchedule.meal.description,
        recipe: mealSchedule.meal.recipe,
        servings: mealSchedule.meal.servings,
        ingredients: mealSchedule.meal.ingredients.map((ingredient: any) => ({
          id: ingredient.id,
          quantityGrams: Number(ingredient.quantityGrams),
          ingredient: {
            id: ingredient.ingredient.id,
            name: ingredient.ingredient.name,
            brand: ingredient.ingredient.brand,
            caloriesPer100g: Number(ingredient.ingredient.caloriesPer100g),
            proteinPer100g: Number(ingredient.ingredient.proteinPer100g),
            carbsPer100g: Number(ingredient.ingredient.carbsPer100g),
            fatPer100g: Number(ingredient.ingredient.fatPer100g),
            fiberPer100g: ingredient.ingredient.fiberPer100g ? Number(ingredient.ingredient.fiberPer100g) : undefined,
            sugarPer100g: ingredient.ingredient.sugarPer100g ? Number(ingredient.ingredient.sugarPer100g) : undefined,
            sodiumPer100g: ingredient.ingredient.sodiumPer100g ? Number(ingredient.ingredient.sodiumPer100g) : undefined,
          },
        })),
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        totalFiber: totalFiber > 0 ? totalFiber : undefined,
        totalSugar: totalSugar > 0 ? totalSugar : undefined,
        totalSodium: totalSodium > 0 ? totalSodium : undefined,
      },
    };
  }
}
