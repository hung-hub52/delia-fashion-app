import {
  BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req,
  UploadedFile, UseGuards, UseInterceptors, ForbiddenException, Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import type { Express } from 'express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* ---------------- Customers ---------------- */
  @ApiOperation({ summary: 'Danh sách khách hàng' })
  @Get('customers')
  findAllCustomers() {
    return this.usersService.findAllCustomers();
  }

  @ApiOperation({ summary: 'Khoá tài khoản' })
  @Patch(':id/lock')
  lockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.lockUser(id);
  }

  @ApiOperation({ summary: 'Mở khoá tài khoản' })
  @Patch(':id/unlock')
  unlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unlockUser(id);
  }

  /* ---------------- Me ---------------- */
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  @Get('me')
  getMe(@Req() req: any) {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung;
    return this.usersService.getMe(Number(userId));
  }

  @ApiOperation({ summary: 'Cập nhật hồ sơ (họ tên/SĐT/email/địa chỉ)' })
  @Patch('me')
  updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung;
    return this.usersService.updateMe(Number(userId), dto);
  }

  /* ---------------- Avatar ---------------- */
  private static readonly AVATAR_DIR = join(process.cwd(), 'uploads', 'avatars');

  @ApiOperation({ summary: 'Upload avatar (.png/.jpg), lưu DB và trả URL' })
  @ApiConsumes('multipart/form-data')
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          try { fs.mkdirSync(UsersController.AVATAR_DIR, { recursive: true }); } catch {}
          cb(null, UsersController.AVATAR_DIR);
        },
        filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req: any, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        const ok =
          (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') &&
          ['.png', '.jpg', '.jpeg'].includes(extname(file.originalname).toLowerCase());
        cb(ok ? null : new BadRequestException('Chỉ chấp nhận .png/.jpg'), ok);
      },
    }),
  )
  async uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Không có file');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung;
    await this.usersService.updateAvatar(Number(userId), avatarUrl);
    return { ok: true, avatar_url: avatarUrl };
  }

  /* ---------------- Addresses (địa chỉ) ----------------
     Lưu vào cột users.dia_chi theo format yêu cầu.
     - GET  /users/:id/addresses   -> { list: [ dia_chi ] } (hiện tại 1 địa chỉ chính)
     - POST /users/:id/addresses   -> body: { city, ward?, detail, type?, isDefault? }
       Họ tên + SĐT: nếu FE không gửi thì tự lấy từ DB.
  ------------------------------------------------------ */
  @ApiOperation({ summary: 'Lấy địa chỉ của user (địa chỉ chính)' })
  @Get(':id/addresses')
  async getAddresses(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    this.ensureOwnerOrAdmin(req, id);
    const user = await this.usersService.getMe(id);
    const addr = user.dia_chi || '';
    return { list: addr ? [addr] : [] };
  }

  @ApiOperation({ summary: 'Thêm/Cập nhật địa chỉ chính của user' })
  @Post(':id/addresses')
  async createAddress(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any, // <- nhận any để service tự chuẩn hoá
  ) {
    this.ensureOwnerOrAdmin(req, id);
    return this.usersService.createOrUpdatePrimaryAddress(id, body);
  }

  /* helper: chỉ chủ sở hữu hoặc admin mới thao tác */
  private ensureOwnerOrAdmin(req: any, id: number) {
    const uid = Number(req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung);
    const role = req.user?.vai_tro ?? req.user?.role;
    if (uid !== id && role !== 'admin') {
      throw new ForbiddenException('Không có quyền');
    }
  }

  @ApiOperation({ summary: 'Xoá địa chỉ (clear users.dia_chi của chính mình)' })
  @Delete(':id/addresses')
  async removeAddress(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const authId =
      req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung;
    if (Number(authId) !== Number(id)) {
      throw new BadRequestException('Bạn chỉ có thể xoá địa chỉ của chính mình');
    }
    await this.usersService.clearAddress(Number(id));
    return { ok: true };
  }
}
