// src/modules/categories/categories.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  // List + lọc + phân trang
  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 20, q, parent_id } = query;

    const where: any = {};
    if (q) where.ten_danh_muc = ILike(`%${q}%`);
    if (parent_id !== undefined) where.parent_id = parent_id;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { parent_id: 'ASC', ten_danh_muc: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  // Tree đơn giản (root + children)
  async tree() {
    const all = await this.repo.find({ order: { ten_danh_muc: 'ASC' } });
    const byParent = new Map<number, Category[]>();
    all.forEach((c) => {
      const pid = c.parent_id || 0;
      if (!byParent.has(pid)) byParent.set(pid, []);
      (byParent.get(pid) ?? []).push(c);
    });
    const build = (pid: number) =>
      (byParent.get(pid) || []).map((n) => ({ ...n, children: build(n.id_danh_muc) }));
    return build(0);
  }

  // Create
  async create(dto: CreateCategoryDto) {
    const parent_id = dto.parent_id ?? 0;
    if (parent_id !== 0) {
      const parent = await this.repo.findOne({ where: { id_danh_muc: parent_id } });
      if (!parent) throw new BadRequestException('parent_id không tồn tại');
    }

    const dup = await this.repo.findOne({
      where: { ten_danh_muc: dto.ten_danh_muc, parent_id },
    });
    if (dup) throw new BadRequestException('Tên đã tồn tại trong cấp này');

    const entity = this.repo.create({ ...dto, parent_id });
    return this.repo.save(entity);
  }

  // Update
  async update(id: number, dto: UpdateCategoryDto) {
    const found = await this.repo.findOne({ where: { id_danh_muc: id } });
    if (!found) throw new NotFoundException('Không tìm thấy danh mục');

    const parent_id = dto.parent_id ?? found.parent_id;
    if (parent_id !== 0) {
      const parent = await this.repo.findOne({ where: { id_danh_muc: parent_id } });
      if (!parent) throw new BadRequestException('parent_id không tồn tại');
      if (parent.id_danh_muc === id) throw new BadRequestException('Không thể đặt parent là chính nó');
    }

    // check trùng tên cùng cấp
    if (dto.ten_danh_muc || dto.parent_id !== undefined) {
      const name = dto.ten_danh_muc ?? found.ten_danh_muc;
      const pid = dto.parent_id ?? found.parent_id;
      const dup = await this.repo.findOne({
        where: { ten_danh_muc: name, parent_id: pid },
      });
      if (dup && dup.id_danh_muc !== id) {
        throw new BadRequestException('Tên đã tồn tại trong cấp này');
      }
    }

    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id_danh_muc: id } });
  }

  // Delete (hard)
  async remove(id: number) {
    // cấm xóa nếu còn con
    const child = await this.repo.count({ where: { parent_id: id } });
    if (child > 0) throw new BadRequestException('Vui lòng xóa/di chuyển danh mục con trước');
    await this.repo.delete(id);
    return { success: true };
  }

    


}
