// src/items/items.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  findAll() {
    return [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  }
}
