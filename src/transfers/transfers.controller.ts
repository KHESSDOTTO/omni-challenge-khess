import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Get
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('transfer')
export class TransfersController {
  constructor(private readonly TransfersService: TransfersService) {}

  @Get()
  @HttpCode(200) // Default, somente explicitando
  findAll() {
    return this.TransfersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(204)
  create(@Body() createTransferDto: CreateTransferDto) {
    return this.TransfersService.create(createTransferDto);
  }
}
