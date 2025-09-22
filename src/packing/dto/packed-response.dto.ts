import { ApiProperty } from '@nestjs/swagger';

class ProductRefDto {
  @ApiProperty({ example: 'p1' })
  id: string;
}

export class PackedBoxDto {
  @ApiProperty({ example: 'box1' })
  boxId: string;

  @ApiProperty({ example: 'Caixa 1' })
  boxName: string;

  @ApiProperty({ type: [ProductRefDto] })
  products: ProductRefDto[];
}

export class PackedOrderDto {
  @ApiProperty({ example: 'order1' })
  orderId: string;

  @ApiProperty({ type: [PackedBoxDto] })
  boxes: PackedBoxDto[];
}
