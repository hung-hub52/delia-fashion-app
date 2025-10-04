// src/modules/products/products.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginateQueryDto } from '../../common/dto/paginate-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get() findAll(@Query() q: PaginateQueryDto) { return this.service.findAll(q); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() create(@Body() body: CreateProductDto) { return this.service.create(body); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) { return this.service.update(id, body); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  // Upload product image
  @ApiConsumes('multipart/form-data')
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'products');
          try { fs.mkdirSync(dir, { recursive: true }); } catch {}
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extname(file.originalname).toLowerCase()}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ok =
          (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') &&
          ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(file.originalname).toLowerCase());
        cb(ok ? null : new Error('Invalid file type'), ok);
      },
    }),
  )
  async uploadImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) return { message: 'No file uploaded' };
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/products/${file.filename}`;
    return { ok: true, image_url: url };
  }
}
