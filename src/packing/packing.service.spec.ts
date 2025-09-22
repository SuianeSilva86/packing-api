import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from './packing.service';

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('packs simple orders into available boxes', () => {
    const orders = [
      {
        id: 'order1',
        products: [
          { id: 'p1', name: 'Game A', height: 10, width: 10, length: 10 },
          { id: 'p2', name: 'Game B', height: 20, width: 20, length: 20 },
        ],
      },
    ];

    const result = service.packOrders(orders as any);
    expect(result).toHaveLength(1);
    expect(result[0].orderId).toBe('order1');
    // all products must be assigned to boxes
    const assignedProducts = result[0].boxes.flatMap((b) => b.products.map((p) => p.id));
    expect(assignedProducts.sort()).toEqual(['p1', 'p2'].sort());
  });

  it("throws when a product doesn't fit any box", () => {
    const orders = [
      {
        id: 'order2',
        products: [
          { id: 'big', name: 'Huge', height: 100, width: 100, length: 100 },
        ],
      },
    ];

    expect(() => service.packOrders(orders as any)).toThrow();
  });
});
