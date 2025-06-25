import React from "react";
import { Button, Image, InputField, AuthButton } from '../common';

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Smiles First Logo" className="h-8" />
        <span className="text-smiles-orange font-semibold text-xl">Dens 'n Dente USA</span>
      </div>
      <InputField
        placeholder="Search dental products..."
        className="flex-1 mx-6 text-sm"
      />
      <div className="flex items-center gap-4">
        <AuthButton />
      </div>
    </header>
  );
}
