import { Injectable, BadRequestException } from '@nestjs/common';
import { BoxSpec, Dimension, Order, PackedBox, PackedOrder, Product } from './types/models';

@Injectable()
export class PackingService {
  // available boxes (pre-defined)
  private readonly boxes: BoxSpec[] = [
    { id: 'box1', name: 'Caixa 1', dimension: { height: 30, width: 40, length: 80 } },
    { id: 'box2', name: 'Caixa 2', dimension: { height: 50, width: 50, length: 40 } },
    { id: 'box3', name: 'Caixa 3', dimension: { height: 50, width: 80, length: 60 } },
  ];

  // Public contract: receive orders and return packed orders
  packOrders(orders: Order[]): PackedOrder[] {
    if (!orders || !Array.isArray(orders)) {
      throw new BadRequestException('orders must be an array');
    }

    return orders.map((order) => this.packOrder(order));
  }

  private packOrder(order: Order): PackedOrder {
    const remaining = [...order.products];
    const boxes: PackedBox[] = [];

    // sort boxes by volume ascending to try to use smaller boxes first
    const boxesByVolume = [...this.boxes].sort((a, b) => this.volume(a.dimension) - this.volume(b.dimension));

    // simple greedy packing: for each box size, try to fill with products that fit individually
    for (const box of boxesByVolume) {
      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < remaining.length; i++) {
          const product = remaining[i];
          if (this.fitsInBox(product as any, box.dimension)) {
            // place product in this box
            const existing = boxes.find((b) => b.boxId === box.id);
            if (existing) {
              existing.products.push(product);
            } else {
              boxes.push({ boxId: box.id, boxName: box.name, products: [product] });
            }
            remaining.splice(i, 1);
            changed = true;
            break; // restart scan after mutation
          }
        }
      }
    }

    if (remaining.length > 0) {
      // Some products didn't fit any box individually
      throw new BadRequestException(`Some products in order ${order.id} don't fit in any available box`);
    }

    return { orderId: order.id, boxes };
  }

  // check if a product with dimension p fits into box dimension b by orientation (allow rotation)
  private fitsInBox(p: Product | Dimension, b: Dimension): boolean {
    // product may be provided as Product (flat) or Dimension
    const pHeight = (p as any).height;
    const pWidth = (p as any).width;
    const pLength = (p as any).length;

    const pDims = [pHeight, pWidth, pLength].sort((x, y) => x - y);
    const bDims = [b.height, b.width, b.length].sort((x, y) => x - y);
    return pDims[0] <= bDims[0] && pDims[1] <= bDims[1] && pDims[2] <= bDims[2];
  }

  private volume(d: Dimension): number {
    return d.height * d.width * d.length;
  }
}

export default PackingService;
