import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Order } from '../types/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({ example: 'p1', description: 'Identificador do produto' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ example: 'Game A', description: 'Nome do produto' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 10, description: 'Altura em centímetros' })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({ example: 10, description: 'Largura em centímetros' })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ example: 10, description: 'Comprimento em centímetros' })
  @IsNumber()
  @Min(0)
  length: number;
}

class OrderDto implements Order {
  @ApiProperty({ example: 'order1', description: 'Identificador do pedido' })
  @IsString()
  id: string;

  @ApiProperty({ type: [ProductDto], description: 'Lista de produtos deste pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}

export class PackOrdersDto {
  @ApiProperty({ type: [OrderDto], description: 'Lista de pedidos' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  orders: OrderDto[];
}
