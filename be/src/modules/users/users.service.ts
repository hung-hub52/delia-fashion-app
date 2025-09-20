import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  findAllCustomers() {
    return this.userRepo.find({
      where: { vai_tro: 'khachhang' },
      select: ['id_nguoidung','ho_ten','email','so_dien_thoai','dia_chi','trang_thai'],
      order: { id_nguoidung: 'DESC' },
    });
  }

  async lockUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.vai_tro === 'admin') throw new BadRequestException('Không thể khóa tài khoản admin');

    user.trang_thai = 0; // khóa
    await this.userRepo.save(user);
    return { message: 'Đã khóa tài khoản', id: user.id_nguoidung };
  }

  async unlockUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    user.trang_thai = 1; // hoạt động lại
    await this.userRepo.save(user);
    return { message: 'Đã mở khóa tài khoản', id: user.id_nguoidung };
  }
}
