import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Danh sách khách hàng' })
  @Get('customers')
  findAllCustomers() {
    return this.usersService.findAllCustomers();
  }

   @Patch(':id/lock')
  lockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.lockUser(id);
  }

  @Patch(':id/unlock')
  unlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unlockUser(id);
  }
}
