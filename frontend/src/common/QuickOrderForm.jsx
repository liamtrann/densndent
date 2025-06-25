import React from "react";
import { InputField, Button } from './index';

export default function QuickOrderForm() {
  return (
    <div className="flex gap-2">
      <InputField placeholder="Item Code" className="px-2 py-1 w-full" />
      <InputField placeholder="Qty" className="px-2 py-1 w-1/3" />
      <Button variant="primary" className="px-3 py-1">Add</Button>
    </div>
  );
}
