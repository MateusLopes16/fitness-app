import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealDto } from './dto/meal.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MealType } from '@prisma/client';

@ApiTags('meals')
@Controller('meals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meal' })
  @ApiResponse({ status: 201, description: 'Meal created successfully', type: MealDto })
  async create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: any,
  ): Promise<MealDto> {
    return this.mealsService.create(createMealDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible meals' })
  @ApiResponse({ status: 200, description: 'Meals retrieved successfully', type: [MealDto] })
  async findAll(
    @CurrentUser() user: any,
    @Query('mealType') mealType?: MealType,
  ): Promise<MealDto[]> {
    return this.mealsService.findAll(user.sub, mealType);
  }

  @Get('date/:date')
  @ApiOperation({ summary: 'Get user meals for a specific date' })
  @ApiResponse({ status: 200, description: 'Meals for date retrieved successfully', type: [MealDto] })
  async findByDate(
    @Param('date') date: string,
    @CurrentUser() user: any,
  ): Promise<MealDto[]> {
    return this.mealsService.findUserMealsByDate(user.sub, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific meal' })
  @ApiResponse({ status: 200, description: 'Meal retrieved successfully', type: MealDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<MealDto> {
    return this.mealsService.findOne(id, user.sub);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a meal as personal meal' })
  @ApiResponse({ status: 201, description: 'Meal duplicated successfully', type: MealDto })
  async duplicate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { mealType?: MealType; date?: string },
    @CurrentUser() user: any,
  ): Promise<MealDto> {
    return this.mealsService.duplicateAsPersonal(id, user.sub, body.mealType, body.date);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meal' })
  @ApiResponse({ status: 200, description: 'Meal updated successfully', type: MealDto })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: any,
  ): Promise<MealDto> {
    return this.mealsService.update(id, updateMealDto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal' })
  @ApiResponse({ status: 200, description: 'Meal deleted successfully' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.mealsService.remove(id, user.sub);
  }
}
