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
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientDto } from './dto/ingredient.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

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
  async findAll(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
  ): Promise<PaginatedResponseDto<IngredientDto>> {
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    
    const paginationDto: PaginationDto = {
      page: Math.max(1, page), // Ensure page is at least 1
      limit: Math.min(100, Math.max(1, limit)), // Ensure limit is between 1-100
    };
    
    console.log('Ingredients API called with pagination:', paginationDto, 'search:', search);
    return this.ingredientsService.findAllPaginated(user.sub, search, paginationDto);
  }

  // Keep the original method for backward compatibility
  @Get('all')
  async findAllLegacy(
    @CurrentUser() user: any,
    @Query('search') search?: string,
  ): Promise<IngredientDto[]> {
    return this.ingredientsService.findAll(user.sub, search);
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
