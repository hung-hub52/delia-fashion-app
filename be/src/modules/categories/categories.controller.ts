// src/modules/categories/categories.controller.ts
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';


@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // đọc: chỉ cần có token (hoặc mở public nếu bạn muốn)
  @ApiOperation({ summary: 'Danh sách danh mục (phân trang, tìm kiếm)' })

  @Get()
  findAll(@Query() query: QueryCategoryDto) {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Cây danh mục' })

  @Get('tree')
  tree() {
    return this.service.tree();
  }

  // ghi: admin
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo danh mục' })
  
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa danh mục' })
  
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục (cấm xóa khi còn con)' })
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

}