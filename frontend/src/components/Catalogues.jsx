import React from "react";
import Button from "../common/Button";
import { Image } from '../common';

export default function Catalogues() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 bg-white">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-smiles-orange mb-3">Catalogues</h2>
        <p className="text-gray-700 mb-4">
          Browse our catalogues for exclusive discounts on dental supplies, instruments, equipment, and disposables.
        </p>
        <Button onClick={() => {}}>Show now</Button>
      </div>
      <Image src="/catalogue-banner.png" alt="Catalogues" className="w-full md:w-1/2 rounded-lg" />
    </section>
  );
}
