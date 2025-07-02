// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import AuthButton from "../common/AuthButton";

export default function Header() {
  const [isProductsHovered, setProductsHovered] = useState(false);
  const cart = useSelector((state) => state.cart.items);
  const totalProducts = cart.length;

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between relative z-50">
      {/* LEFT: Logo and Navigation */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Smiles First Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-orange-600">Dens 'n Dente USA</span>
        </Link>

        {/* Nav links */}
        <nav className="flex space-x-6 relative">
          <Link to="/" className="text-sm text-gray-700 hover:text-orange-600">Home</Link>
          <div
            className="relative"
            onMouseEnter={() => setProductsHovered(true)}
            onMouseLeave={() => setProductsHovered(false)}
          >
            <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Products</span>

            {isProductsHovered && (
              <div className="absolute left-0 top-full mt-2 w-[90vw] bg-white shadow-xl border rounded-md p-6 flex flex-wrap z-50 max-h-[80vh] overflow-y-auto">
                {/* COLUMNS */}
                {[
                  {
                    title: "D2 (House Brand)",
                    links: [{ name: "All D2 Products", path: "/brands/d2-healthcare" }],
                  },
                  {
                    title: "Alloys",
                    links: [{ name: "Amalgam", path: "/category/amalgam" }],
                  },
                  {
                    title: "Anesthetics",
                    links: [
                      { name: "Injectables", path: "/category/injectables" },
                      { name: "Needles", path: "/category/needles" },
                      { name: "Sutures", path: "/category/sutures" },
                      { name: "Topical", path: "/category/topical" },
                    ],
                  },
                  {
                    title: "Burs",
                    links: [
                      { name: "Burs Accessories", path: "/category/burs-accessories" },
                      { name: "Carbide", path: "/category/carbide" },
                      { name: "Diamonds", path: "/category/diamonds" },
                      { name: "Finishing", path: "/category/finishing" },
                      { name: "Latch", path: "/category/latch" },
                    ],
                  },
                  {
                    title: "Cements & Liners",
                    links: [
                      { name: "Cavity & Liners", path: "/category/cavity-liners" },
                      { name: "Cements", path: "/category/cements" },
                      { name: "Temporary Filling Materials", path: "/category/temp-fillings" },
                    ],
                  },
                  {
                    title: "Crowns & Bridges",
                    links: [
                      { name: "Crown", path: "/category/crown" },
                      { name: "Retraction Materials", path: "/category/retraction-materials" },
                      { name: "Temporary Crowns & Bridges", path: "/category/temp-crowns-bridges" },
                      { name: "Acrylics", path: "/category/acrylics" },
                    ],
                  },
                  {
                    title: "Endodontics",
                    links: [
                      { name: "Absorbent Points", path: "/category/absorbent-points" },
                      { name: "Barbed Broaches", path: "/category/barbed-broaches" },
                      { name: "Drills & Reamers", path: "/category/drills-reamers" },
                      { name: "Endo Files", path: "/category/endo-files" },
                      { name: "Endodontic Accessories", path: "/category/endodontic-accessories" },
                      { name: "Rotary Endo", path: "/category/rotary-endo" },
                      { name: "Rubber Dam Accessories", path: "/category/rubber-dam" },
                      { name: "Sealers", path: "/category/sealers" },
                    ],
                  },
                  {
                    title: "Equipments",
                    links: [
                      { name: "Autoclave", path: "/category/autoclave" },
                      { name: "Chairs & Stools", path: "/category/chairs-stools" },
                      { name: "Endo", path: "/category/endo" },
                      { name: "Equipment Accessories", path: "/category/equipment-accessories" },
                      { name: "Equipment Parts", path: "/category/equipment-parts" },
                      { name: "Equipment Repair", path: "/category/equipment-repair" },
                      { name: "Handpiece", path: "/category/handpiece" },
                      { name: "Parts", path: "/category/parts" },
                      { name: "Sensors", path: "/category/sensors" },
                      { name: "Small Equipment", path: "/category/small-equipment" },
                      { name: "X-Ray Equipment", path: "/category/x-ray-equipment" },
                    ],
                  },
                  {
                    title: "Impression Materials",
                    links: [
                      { name: "Alginate", path: "/category/alginate" },
                      { name: "Bite Registration", path: "/category/bite-registration" },
                      { name: "Impression Accessories", path: "/category/impression-accessories" },
                      { name: "Mixing Tips", path: "/category/mixing-tips" },
                      { name: "Rubber Base", path: "/category/rubber-base" },
                      { name: "Polyether", path: "/category/polyether" },
                      { name: "Post & Pins", path: "/category/post-pins" },
                      { name: "Soft Liners", path: "/category/soft-liners" },
                      { name: "Syringes", path: "/category/syringes" },
                      { name: "Tray Adhesive", path: "/category/tray-adhesive" },
                      { name: "Trays", path: "/category/trays" },
                      { name: "VPS", path: "/category/vps" },
                    ],
                  },
                  {
                    title: "Infection Control",
                    links: [
                      { name: "Barriers & Covers", path: "/category/barriers-covers" },
                      { name: "Dental Disposable", path: "/category/dental-disposable" },
                      { name: "Evacuation Cleaners", path: "/category/evacuation-cleaners" },
                      { name: "Gloves", path: "/category/gloves" },
                      { name: "Hand Soaps", path: "/category/hand-soaps" },
                      { name: "Mask", path: "/category/mask" },
                      { name: "Sterilants", path: "/category/sterilants" },
                      { name: "Sterilization Products", path: "/category/sterilization-products" },
                      { name: "Surface Disinfectant", path: "/category/surface-disinfectant" },
                      { name: "Tray Cover", path: "/category/tray-cover" },
                      { name: "Ultrasonic Cleaners", path: "/category/ultrasonic-cleaners" },
                    ],
                  },
                  {
                    title: "Instruments",
                    links: [
                      { name: "Cassette & Accessories", path: "/category/cassette" },
                      { name: "Diagnostic", path: "/category/diagnostic" },
                      { name: "Endodontic Instruments", path: "/category/endodontic-instruments" },
                      { name: "Forceps", path: "/category/forceps" },
                      { name: "Instrument Care", path: "/category/instrument-care" },
                      { name: "Orthodontic Instruments", path: "/category/orthodontic-instruments" },
                      { name: "Periodontal Instruments", path: "/category/periodontal-instruments" },
                      { name: "Surgical Instruments", path: "/category/surgical-instruments" },
                    ],
                  },
                  {
                    title: "Matrix Systems",
                    links: [
                      { name: "Matrix Bands", path: "/category/matrix-bands" },
                      { name: "Matrix Materials", path: "/category/matrix-materials" },
                      { name: "Ring & Accessories", path: "/category/ring-accessories" },
                      { name: "Sytems", path: "/category/systems" },
                    ],
                  },
                  {
                    title: "Office Supplies",
                    links: [
                      { name: "Scrub", path: "/category/scrub" },
                      { name: "Toys & Stickers", path: "/category/toys-stickers" },
                    ],
                  },
                  {
                    title: "Orthodontics",
                    links: [
                      { name: "Archwires", path: "/category/archwires" },
                      { name: "Bands & Attachments", path: "/category/bands-attachments" },
                      { name: "Brackets", path: "/category/brackets" },
                      { name: "Miscellaneous", path: "/category/orthodontic-misc" },
                    ],
                  },
                  {
                    title: "Preventatives",
                    links: [
                      { name: "Bibs", path: "/category/bibs" },
                      { name: "Cotton Roll", path: "/category/cotton-roll" },
                      { name: "Cotton Tip", path: "/category/cotton-tip" },
                      { name: "Dental Cups", path: "/category/dental-cups" },
                      { name: "Disclosing Products", path: "/category/disclosing" },
                      { name: "Floss", path: "/category/floss" },
                      { name: "Fluoride Rinse", path: "/category/fluoride-rinse" },
                      { name: "Fluoride Trays", path: "/category/fluoride-trays" },
                      { name: "Gauze", path: "/category/gauze" },
                      { name: "Hand Towels & Tissue", path: "/category/hand-towels" },
                      { name: "Mouthwash", path: "/category/mouthwash" },
                      { name: "Oral Rinses", path: "/category/oral-rinses" },
                      { name: "Pit & Fissure Sealant", path: "/category/fissure-sealant" },
                      { name: "Preventatives Misc", path: "/category/preventative-misc" },
                      { name: "Prophy", path: "/category/prophy" },
                      { name: "Saliva Ejectors", path: "/category/saliva-ejectors" },
                      { name: "Sealants", path: "/category/sealants" },
                      { name: "Toothbrush", path: "/category/toothbrush" },
                      { name: "Toothpaste", path: "/category/toothpaste" },
                    ],
                  },
                  {
                    title: "Restoratives",
                    links: [
                      { name: "Articulating Paper", path: "/category/articulating-paper" },
                      { name: "Bonds", path: "/category/bonds" },
                      { name: "Composites", path: "/category/composites" },
                      { name: "Desensitizer", path: "/category/desensitizer" },
                      { name: "Etchants", path: "/category/etchants" },
                      { name: "Flowable", path: "/category/flowable" },
                      { name: "Glass Ionomer", path: "/category/glass-ionomer" },
                      { name: "Polishing & Finishing", path: "/category/polishing-finishing" },
                      { name: "Restoratives Accessories", path: "/category/restorative-accessories" },
                    ],
                  },
                  {
                    title: "Whitening",
                    links: [{ name: "Home Kit", path: "/category/home-kit" }],
                  },
                  {
                    title: "X-Ray",
                    links: [
                      { name: "Chemicals", path: "/category/xray-chemicals" },
                      { name: "Films", path: "/category/xray-films" },
                      { name: "X-Ray Accessories", path: "/category/xray-accessories" },
                    ],
                  },
                  {
                    title: "Other",
                    links: [
                      { name: "Emergency Products", path: "/category/emergency" },
                      { name: "Eyewear & Accessories", path: "/category/eyewear" },
                      { name: "Implant", path: "/category/implant" },
                      { name: "Miscellaneous", path: "/category/miscellaneous" },
                      { name: "Waste Management", path: "/category/waste-management" },
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="min-w-[180px] mr-8 mb-4">
                    <h4 className="font-semibold mb-2 text-sm">{section.title}</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {section.links.map((link, idx) => (
                        <li key={idx}>
                          <Link to={link.path} className="hover:text-orange-600">{link.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* RIGHT: Auth and Cart */}
      <div className="flex items-center space-x-4">
        <AuthButton />
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
          {totalProducts > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
              {totalProducts}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
