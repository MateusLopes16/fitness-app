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
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientDto } from './dto/ingredient.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  async create(
    @Body() createIngredientDto: CreateIngredientDto,
    @CurrentUser() user: any,
  ): Promise<IngredientDto> {
    return this.ingredientsService.create(createIngredientDto, user.sub);
  }

  @Get()
  async findAll(@CurrentUser() user: any): Promise<IngredientDto[]> {
    return this.ingredientsService.findAll(user.sub);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<IngredientDto> {
    return this.ingredientsService.findOne(id, user.sub);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @CurrentUser() user: any,
  ): Promise<IngredientDto> {
    return this.ingredientsService.update(id, updateIngredientDto, user.sub);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.ingredientsService.remove(id, user.sub);
  }
}
