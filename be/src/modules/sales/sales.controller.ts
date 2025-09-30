import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ShareEmailDto } from './dto/share-email.dto';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @ApiOperation({ summary: 'Danh sách khuyến mãi' })
  @Get()
  list() {
    return this.service.list();
  }

  @ApiOperation({ summary: 'Tạo mã khuyến mãi' })
  @Post()
  create(@Body() body: CreateSaleDto) {
    return this.service.create(body);
  }

  @ApiOperation({ summary: 'Vô hiệu hoá mã' })
  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.service.disable(id);
  }

  @ApiOperation({ summary: 'Áp dụng mã (kiểm tra hạn & trạng thái)' })
  @Post(':id/apply')
  apply(@Param('id', ParseIntPipe) id: number) {
    return this.service.apply(id);
  }

  @ApiOperation({ summary: 'Xoá mã' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @ApiOperation({ summary: 'Chia sẻ khuyến mãi qua Email' })
  @Post(':id/share-email')
  shareEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShareEmailDto,
  ) {
    return this.service.shareEmail(id, dto);
  }
}
