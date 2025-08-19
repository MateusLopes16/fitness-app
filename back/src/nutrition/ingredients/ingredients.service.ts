import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientDto } from './dto/ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private database: DatabaseService) {}

  async create(createIngredientDto: CreateIngredientDto, userId: string): Promise<IngredientDto> {
    const ingredient = await this.database.ingredient.create({
      data: {
        ...createIngredientDto,
        createdBy: userId,
      },
    });

    return this.mapToDto(ingredient);
  }

  async findAll(userId: string, search?: string): Promise<IngredientDto[]> {
    // Get ingredients created by admin (createdBy is null) or by the current user
    const whereCondition: any = {
      OR: [
        { createdBy: null }, // Admin ingredients
        { createdBy: userId }, // User's own ingredients
      ],
    };

    // Add search condition if provided
    if (search) {
      whereCondition.AND = [
        whereCondition,
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
      // Remove the original OR condition since it's now in AND
      delete whereCondition.OR;
      whereCondition.AND[0] = {
        OR: [
          { createdBy: null }, // Admin ingredients
          { createdBy: userId }, // User's own ingredients
        ],
      };
    }

    const ingredients = await this.database.ingredient.findMany({
      where: whereCondition,
      orderBy: {
        name: 'asc',
      },
    });

    return ingredients.map(ingredient => this.mapToDto(ingredient));
  }

  async findOne(id: string, userId: string): Promise<IngredientDto> {
    const ingredient = await this.database.ingredient.findFirst({
      where: {
        id,
        OR: [
          { createdBy: null }, // Admin ingredients
          { createdBy: userId }, // User's own ingredients
        ],
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    return this.mapToDto(ingredient);
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto, userId: string): Promise<IngredientDto> {
    // First check if the ingredient exists and belongs to the user
    const existingIngredient = await this.database.ingredient.findUnique({
      where: { id },
    });

    if (!existingIngredient) {
      throw new NotFoundException('Ingredient not found');
    }

    // Only allow users to update their own ingredients, not admin ingredients
    if (existingIngredient.createdBy !== userId) {
      throw new ForbiddenException('You can only update ingredients you created');
    }

    const ingredient = await this.database.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });

    return this.mapToDto(ingredient);
  }

  async remove(id: string, userId: string): Promise<void> {
    // First check if the ingredient exists and belongs to the user
    const existingIngredient = await this.database.ingredient.findUnique({
      where: { id },
    });

    if (!existingIngredient) {
      throw new NotFoundException('Ingredient not found');
    }

    // Only allow users to delete their own ingredients, not admin ingredients
    if (existingIngredient.createdBy !== userId) {
      throw new ForbiddenException('You can only delete ingredients you created');
    }

    await this.database.ingredient.delete({
      where: { id },
    });
  }

  private mapToDto(ingredient: any): IngredientDto {
    return {
      id: ingredient.id,
      name: ingredient.name,
      brand: ingredient.brand,
      barcode: ingredient.barcode,
      caloriesPer100g: parseFloat(ingredient.caloriesPer100g.toString()),
      proteinPer100g: parseFloat(ingredient.proteinPer100g.toString()),
      carbsPer100g: parseFloat(ingredient.carbsPer100g.toString()),
      fatPer100g: parseFloat(ingredient.fatPer100g.toString()),
      fiberPer100g: ingredient.fiberPer100g ? parseFloat(ingredient.fiberPer100g.toString()) : undefined,
      sugarPer100g: ingredient.sugarPer100g ? parseFloat(ingredient.sugarPer100g.toString()) : undefined,
      sodiumPer100g: ingredient.sodiumPer100g ? parseFloat(ingredient.sodiumPer100g.toString()) : undefined,
      createdBy: ingredient.createdBy,
      createdByType: ingredient.createdBy ? 'user' : 'admin',
      createdAt: ingredient.createdAt,
    };
  }
}
