import { Module } from '@nestjs/common';
import { MealScheduleService } from './meal-schedule.service';
import { MealScheduleController } from './meal-schedule.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MealScheduleController],
  providers: [MealScheduleService],
  exports: [MealScheduleService],
})
export class MealScheduleModule {}
