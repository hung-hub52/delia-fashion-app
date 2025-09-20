#!/usr/bin/env bash
set -euo pipefail

ROOT="src/modules"
COMMON="src/common"

mkdir -p "$ROOT" "$COMMON/guards" "$COMMON/strategies"

# ---------------------------
# JwtAuth Guard & Strategy
# ---------------------------
cat > "$COMMON/guards/jwt-auth.guard.ts" <<'TS'
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
TS

cat > "$COMMON/strategies/jwt.strategy.ts" <<'TS'
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
    });
  }
  async validate(payload: any) {
    return { id: payload.sub, role: payload.role, email: payload.email };
  }
}
TS

# ---------------------------
# USERS MODULE
# ---------------------------
mkdir -p "$ROOT/users/entities" "$ROOT/users/dto"
cat > "$ROOT/users/entities/user.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('nguoi_dung')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_nguoidung' })
  id_nguoidung: number;

  @Column({ name: 'ho_ten', length: 50 })
  ho_ten: string;

  @Column({ name: 'email', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({
    name: 'vai_tro',
    type: 'enum',
    enum: ['admin','nhanvien','khachhang'],
    default: 'khachhang',
  })
  vai_tro: 'admin' | 'nhanvien' | 'khachhang';

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  trang_thai: number;

  @Column({ name: 'so_dien_thoai', length: 25, nullable: true })
  so_dien_thoai?: string;

  @Column({ name: 'anh_dai_dien', length: 255, nullable: true })
  anh_dai_dien?: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  dia_chi?: string;
}
TS

cat > "$ROOT/users/users.service.ts" <<'TS'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    return this.userRepo.save(this.userRepo.create(user));
  }
}
TS

cat > "$ROOT/users/users.module.ts" <<'TS'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
TS

# ---------------------------
# AUTH MODULE
# ---------------------------
mkdir -p "$ROOT/auth/dto" "$ROOT/auth/entities"
cat > "$ROOT/auth/dto/register.dto.ts" <<'TS'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  ho_ten: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  so_dien_thoai?: string;
  dia_chi?: string;
}
TS

cat > "$ROOT/auth/dto/login.dto.ts" <<'TS'
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
TS

cat > "$ROOT/auth/auth.service.ts" <<'TS'
import { Injectable, BadRequestException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@gmail.com';
    const existed = await this.userRepo.findOne({ where: { email: adminEmail } });
    if (!existed) {
      const hashed = await bcrypt.hash('123123', 10);
      const admin = this.userRepo.create({
        ho_ten: 'Admin',
        email: adminEmail,
        password: hashed,
        vai_tro: 'admin',
        trang_thai: 1,
      });
      await this.userRepo.save(admin);
      console.log('✅ Admin mặc định: admin@gmail.com / 123123');
    }
  }

  async register(dto: RegisterDto) {
    const existed = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existed) throw new BadRequestException('Email đã tồn tại');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      vai_tro: 'khachhang',
      trang_thai: 1,
    });

    const saved = await this.userRepo.save(user);
    return { message: 'Đăng ký thành công', user: { ...saved, password: undefined } };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const payload = { sub: user.id_nguoidung, role: user.vai_tro, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token, user: { ...user, password: undefined } };
  }
}
TS

cat > "$ROOT/auth/auth.controller.ts" <<'TS'
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
TS

cat > "$ROOT/auth/auth.module.ts" <<'TS'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
TS

# ---------------------------
# CATEGORIES MODULE
# ---------------------------
mkdir -p "$ROOT/categories/entities" "$ROOT/categories/dto"
cat > "$ROOT/categories/entities/category.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('danh_muc')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id_danh_muc' })
  id_danh_muc: number;

  @Column({ name: 'ten_danh_muc', length: 100 })
  ten_danh_muc: string;

  @Column({ name: 'parent_id', type: 'int', default: 0 })
  parent_id: number;
}
TS

cat > "$ROOT/categories/dto/create-category.dto.ts" <<'TS'
import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString() ten_danh_muc: string;
  @IsNumber() parent_id: number;
}
TS

cat > "$ROOT/categories/dto/update-category.dto.ts" <<'TS'
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
TS

cat > "$ROOT/categories/categories.service.ts" <<'TS'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() { return this.repo.find({ order: { id_danh_muc: 'ASC' } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id_danh_muc: id } }); }

  create(dto: CreateCategoryDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: UpdateCategoryDto) {
    await this.repo.update({ id_danh_muc: id }, dto);
    return this.findOne(id);
  }
  remove(id: number) { return this.repo.delete({ id_danh_muc: id }); }
}
TS

cat > "$ROOT/categories/categories.controller.ts" <<'TS'
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post() create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
TS

cat > "$ROOT/categories/categories.module.ts" <<'TS'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
TS

# ---------------------------
# INVENTORY / PRODUCTS MODULE
# ---------------------------
mkdir -p "$ROOT/inventory/entities" "$ROOT/inventory/dto"
cat > "$ROOT/inventory/entities/inventory.entity.ts" <<'TS'
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('quan_ly_kho')
export class Inventory {
  @PrimaryColumn({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'ten_nha_kho', length: 255 })
  ten_nha_kho: string;

  @Column({ name: 'so_luong_ton_kho', type: 'decimal', precision: 10, scale: 2 })
  so_luong_ton_kho: number;

  @Column({ name: 'so_luong_nhap', type: 'int' })
  so_luong_nhap: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
TS

cat > "$ROOT/inventory/entities/product.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from './inventory.entity';

@Entity('san_pham')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id_san_pham' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'id_danh_muc', type: 'int' })
  id_danh_muc: number;

  @Column({ name: 'gia_ban', type: 'decimal', precision: 10, scale: 2 })
  gia_ban: number;

  @Column({ name: 'gia_nhap', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gia_nhap?: number;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  mo_ta?: string;

  @Column({ name: 'hinh_anh', length: 255, nullable: true })
  hinh_anh?: string;

  @Column({ name: 'so_luong_nhap', type: 'int', nullable: true })
  so_luong_nhap?: number;

  @Column({ name: 'so_luong_ton', type: 'int', nullable: true })
  so_luong_ton?: number;

  @Column({ name: 'id_kho', type: 'int', nullable: true })
  id_kho?: number;

  @Column({ name: 'trang_thai', length: 255, nullable: true })
  trang_thai?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_danh_muc' })
  danh_muc: Category;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'id_kho' })
  kho: Inventory;
}
TS

cat > "$ROOT/inventory/dto/create-product.dto.ts" <<'TS'
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString() ten_san_pham: string;
  @IsNumber() id_danh_muc: number;
  @IsNumber() gia_ban: number;
  @IsOptional() @IsNumber() gia_nhap?: number;
  @IsOptional() @IsString() mo_ta?: string;
  @IsOptional() @IsString() hinh_anh?: string;
  @IsOptional() @IsNumber() so_luong_nhap?: number;
  @IsOptional() @IsNumber() so_luong_ton?: number;
  @IsOptional() @IsNumber() id_kho?: number;
  @IsOptional() @IsString() trang_thai?: string;
}
TS

cat > "$ROOT/inventory/dto/update-product.dto.ts" <<'TS'
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
export class UpdateProductDto extends PartialType(CreateProductDto) {}
TS

cat > "$ROOT/inventory/products.service.ts" <<'TS'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async paginate(page = 1, pageSize = 10, id_danh_muc?: number) {
    const where = id_danh_muc ? { id_danh_muc } : {};
    const [items, total] = await this.repo.findAndCount({
      where, order: { id_san_pham: 'DESC' }, skip: (page - 1) * pageSize, take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  findOne(id: number) { return this.repo.findOne({ where: { id_san_pham: id } }); }
  create(dto: CreateProductDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: UpdateProductDto) {
    await this.repo.update({ id_san_pham: id }, dto);
    return this.findOne(id);
  }
  remove(id: number) { return this.repo.delete({ id_san_pham: id }); }
}
TS

cat > "$ROOT/inventory/products.controller.ts" <<'TS'
import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(@Query('page') page = 1, @Query('pageSize') pageSize = 10, @Query('category') category?: string) {
    return this.service.paginate(+page, +pageSize, category ? +category : undefined);
  }

  @Get(':id') detail(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateProductDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
TS

cat > "$ROOT/inventory/inventory.module.ts" <<'TS'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Inventory } from './entities/inventory.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class InventoryModule {}
TS

# ---------------------------
# CART MODULE (stubs)
# ---------------------------
mkdir -p "$ROOT/cart/entities" "$ROOT/cart/dto"
cat > "$ROOT/cart/entities/cart.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('gio_hang')
export class Cart {
  @PrimaryGeneratedColumn({ name: 'id_gio_hang' })
  id_gio_hang: number;

  @Column({ name: 'id_nguoidung', type: 'int' })
  id_nguoidung: number;

  @Column({ name: 'ngay_tao', type: 'datetime', nullable: true })
  ngay_tao?: Date;
}
TS

cat > "$ROOT/cart/entities/cart-item.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chi_tiet_gio_hang')
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'id_chi_tiet' })
  id_chi_tiet: number;

  @Column({ name: 'id_gio_hang', type: 'int' })
  id_gio_hang: number;

  @Column({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'so_luong', type: 'int' })
  so_luong: number;
}
TS

cat > "$ROOT/cart/dto/add-to-cart.dto.ts" <<'TS'
import { IsNumber } from 'class-validator';
export class AddToCartDto {
  @IsNumber() id_san_pham: number;
  @IsNumber() so_luong: number;
}
TS

# ---------------------------
# ORDERS MODULE (stubs)
# ---------------------------
mkdir -p "$ROOT/orders/entities" "$ROOT/orders/dto"
cat > "$ROOT/orders/entities/order.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('don_hang')
export class Order {
  @PrimaryGeneratedColumn({ name: 'id_don_hang' })
  id_don_hang: number;

  @Column({ name: 'id_nguoi_dung', type: 'int' })
  id_nguoi_dung: number;

  @Column({ name: 'ten_nguoi_nhan', length: 255 })
  ten_nguoi_nhan: string;

  @Column({ name: 'dia_chi_giao', type: 'text' })
  dia_chi_giao: string;

  @Column({ name: 'trang_thai', length: 255 })
  trang_thai: string;
}
TS

cat > "$ROOT/orders/entities/order-detail.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chi_tiet_don_hang')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id_chi_tiet' })
  id_chi_tiet: number;

  @Column({ name: 'id_don_hang', type: 'int' })
  id_don_hang: number;

  @Column({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'so_luong', type: 'int' })
  so_luong: number;

  @Column({ name: 'don_gia', type: 'decimal', precision: 10, scale: 2 })
  don_gia: number;

  @Column({ name: 'ghi_chu', length: 10, nullable: true })
  ghi_chu?: string;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 10, scale: 2, nullable: true })
  tong_tien?: number;
}
TS

# ---------------------------
# PAYMENTS MODULE (stubs)
# ---------------------------
mkdir -p "$ROOT/payments/entities"
cat > "$ROOT/payments/entities/payment.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('thanh_toan')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id_thanh_toan' })
  id_thanh_toan: number;

  @Column({ name: 'id_don_hang', type: 'int' })
  id_don_hang: number;

  @Column({ name: 'phuong_thuc', type: 'enum', enum: ['tien_mat','chuyen_khoan','vi_dien_tu'] })
  phuong_thuc: 'tien_mat' | 'chuyen_khoan' | 'vi_dien_tu';

  @Column({ name: 'trang_thai', type: 'enum', enum: ['cho_xu_ly','da_thanh_toan','that_bai'] })
  trang_thai: 'cho_xu_ly' | 'da_thanh_toan' | 'that_bai';

  @Column({ name: 'thoi_gian_thanh_toan', type: 'datetime', nullable: true })
  thoi_gian_thanh_toan?: Date;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 10, scale: 2 })
  tong_tien: number;
}
TS

# ---------------------------
# CHAT SUPPORT MODULE (stubs)
# ---------------------------
mkdir -p "$ROOT/chat-support/entities"
cat > "$ROOT/chat-support/entities/chat.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chat_ho_tro')
export class Chat {
  @PrimaryGeneratedColumn({ name: 'id_chat' })
  id_chat: number;

  @Column({ name: 'id_nguoidung', type: 'int' })
  id_nguoidung: number;

  @Column({ name: 'noi_dung', type: 'text' })
  noi_dung: string;

  @Column({ name: 'nguoi_gui', type: 'enum', enum: ['admin','user'] })
  nguoi_gui: 'admin' | 'user';

  @Column({ name: 'thoi_gian', type: 'datetime' })
  thoi_gian: Date;

  @Column({ name: 'trang_thai', type: 'enum', enum: ['chua_doc','da_doc'] })
  trang_thai: 'chua_doc' | 'da_doc';
}
TS

# ---------------------------
# OTP REQUESTS ENTITY
# ---------------------------
mkdir -p "$ROOT/auth/entities"
cat > "$ROOT/auth/entities/otp.entity.ts" <<'TS'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('otp_requests')
export class OtpRequest {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', length: 255 })
  email: string;

  @Column({ name: 'otp', length: 255 })
  otp: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @Column({ name: 'expires_at', type: 'datetime' })
  expires_at: Date;

  @Column({ name: 'ho_ten', length: 255, nullable: true })
  ho_ten?: string;

  @Column({ name: 'so_dien_thoai', length: 255, nullable: true })
  so_dien_thoai?: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  dia_chi?: string;
}
TS

echo "✅ Scaffolded modules, DTOs, and entities under src/modules + src/common"
