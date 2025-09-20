import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginateQueryDto } from '../../common/dto/paginate-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

function fileName(_, file, cb) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(@Query() q: PaginateQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({ destination: './uploads', filename: fileName }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  create(@Body() body: CreateProductDto, @UploadedFile() file?: any) {
    return this.service.create(body, file ? `/uploads/${file.filename}` : undefined);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({ destination: './uploads', filename: fileName }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto, @UploadedFile() file?: any) {
    return this.service.update(id, body, file ? `/uploads/${file.filename}` : undefined);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
