import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MealScheduleService } from './meal-schedule.service';
import { CreateMealScheduleDto, UpdateMealScheduleDto, MealScheduleQueryDto } from './dto/meal-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/v1/meal-schedules')
@UseGuards(JwtAuthGuard)
export class MealScheduleController {
  constructor(private readonly mealScheduleService: MealScheduleService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createMealScheduleDto: CreateMealScheduleDto) {
    return this.mealScheduleService.createMealSchedule(userId, createMealScheduleDto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: MealScheduleQueryDto) {
    return this.mealScheduleService.getMealSchedules(userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.mealScheduleService.getMealSchedule(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMealScheduleDto: UpdateMealScheduleDto,
  ) {
    return this.mealScheduleService.updateMealSchedule(userId, id, updateMealScheduleDto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.mealScheduleService.deleteMealSchedule(userId, id);
  }
}
