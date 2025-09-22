import { Body, Controller, Post } from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackOrdersDto } from './dto/pack-orders.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackedOrderDto } from './dto/packed-response.dto';

const example = {
  orders: [
    {
      id: 'order1',
      products: [
        { id: 'p1', height: 10, width: 10, length: 10 },
        { id: 'p2', height: 20, width: 20, length: 20 },
      ],
    },
  ],
};

@ApiTags('packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  @ApiOperation({ summary: 'Calcula o empacotamento para uma lista de pedidos' })
  @ApiBody({ description: 'Pedidos a serem empacotados', type: PackOrdersDto, examples: { 'flat-format': { value: example } } })
  @ApiResponse({ status: 201, description: 'Pedidos empacotados', type: [PackedOrderDto] })
  pack(@Body() dto: PackOrdersDto) {
    return this.packingService.packOrders(dto.orders);
  }
}
