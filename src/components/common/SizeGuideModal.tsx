import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
  const hasCustomMeasurements = Boolean(
    product?.sizeGuideMode === 'custom' &&
    product?.customMeasurements &&
    Object.keys(product.customMeasurements).length > 0
  );

  const [activeMode, setActiveMode] = useState<'custom' | 'standard'>(
    hasCustomMeasurements ? 'custom' : 'standard'
  );

  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  // Standard measurement rows
  const sizesInches = [
    { size: 'XS', bust: '34"', waist: '28"', hip: '38"', shirtLength: '42"', trouserLength: '38"' },
    { size: 'S', bust: '36"', waist: '30"', hip: '40"', shirtLength: '43"', trouserLength: '38.5"' },
    { size: 'M', bust: '39"', waist: '33"', hip: '43"', shirtLength: '44"', trouserLength: '39"' },
    { size: 'L', bust: '42"', waist: '36"', hip: '46"', shirtLength: '45"', trouserLength: '39.5"' },
    { size: 'XL', bust: '45"', waist: '39"', hip: '49"', shirtLength: '45"', trouserLength: '40"' }
  ];

  const sizesCm = [
    { size: 'XS', bust: '86 cm', waist: '71 cm', hip: '96 cm', shirtLength: '107 cm', trouserLength: '96 cm' },
    { size: 'S', bust: '91 cm', waist: '76 cm', hip: '102 cm', shirtLength: '109 cm', trouserLength: '98 cm' },
    { size: 'M', bust: '99 cm', waist: '84 cm', hip: '109 cm', shirtLength: '112 cm', trouserLength: '99 cm' },
    { size: 'L', bust: '107 cm', waist: '91 cm', hip: '117 cm', shirtLength: '114 cm', trouserLength: '100 cm' },
    { size: 'XL', bust: '114 cm', waist: '99 cm', hip: '124 cm', shirtLength: '114 cm', trouserLength: '102 cm' }
  ];

  const standardTable = unit === 'inches' ? sizesInches : sizesCm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white p-6 sm:p-8 border border-stone-200 z-10 animate-in fade-in font-sans">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-2xl font-light italic text-[#1A1A1A]">GulPash Sizing Guide</h3>
            <p className="text-xs text-stone-500 mt-0.5 font-light">
              {activeMode === 'custom' && product
                ? `Specific Garment Measurements for "${product.title}"`
                : 'Standard Pakistani Ready-to-Wear Measurements'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector if custom measurements exist */}
        {hasCustomMeasurements && (
          <div className="flex items-center gap-2 mt-4 pt-1">
            <button
              type="button"
              onClick={() => setActiveMode('custom')}
              className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'custom'
                  ? 'bg-stone-900 text-white border-stone-900 font-medium'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Article Custom Measurements</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('standard')}
              className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${
                activeMode === 'standard'
                  ? 'bg-stone-900 text-white border-stone-900 font-medium'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              Standard Size Chart
            </button>
          </div>
        )}

        {/* Unit switch for standard guide */}
        {activeMode === 'standard' && (
          <div className="flex items-center justify-end gap-2 my-4">
            <span className="text-xs text-stone-500 font-light">Units:</span>
            <div className="inline-flex border border-stone-200 p-0.5 bg-stone-50">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  unit === 'inches' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                Inches (&quot;)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        )}

        {/* Custom Measurements Table */}
        {activeMode === 'custom' && product?.customMeasurements && (
          <div className="mt-4 overflow-x-auto border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 border-b border-stone-200 uppercase font-medium text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Hips</th>
                  <th className="py-2.5 px-3">Shirt Length</th>
                  <th className="py-2.5 px-3">Trouser Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-light text-stone-600">
                {Object.entries(product.customMeasurements).map(([sz, m]) => (
                  <tr key={sz} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-stone-900 font-mono">{sz}</td>
                    <td className="py-2.5 px-3">{m.chest || '—'}</td>
                    <td className="py-2.5 px-3">{m.waist || '—'}</td>
                    <td className="py-2.5 px-3">{m.hip || '—'}</td>
                    <td className="py-2.5 px-3">{m.length || '—'}</td>
                    <td className="py-2.5 px-3">{m.trouserLength || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Standard Sizing Table */}
        {activeMode === 'standard' && (
          <div className="overflow-x-auto border border-stone-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 border-b border-stone-200 uppercase font-medium text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest / Bust</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Hips</th>
                  <th className="py-2.5 px-3">Shirt Length</th>
                  <th className="py-2.5 px-3">Trouser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-light text-stone-600">
                {standardTable.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-stone-900">{row.size}</td>
                    <td className="py-2.5 px-3">{row.bust}</td>
                    <td className="py-2.5 px-3">{row.waist}</td>
                    <td className="py-2.5 px-3">{row.hip}</td>
                    <td className="py-2.5 px-3">{row.shirtLength}</td>
                    <td className="py-2.5 px-3">{row.trouserLength}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tailoring & Unstitched Note */}
        <div className="mt-4 bg-stone-50 p-4 border border-stone-200 text-xs text-stone-600 space-y-1 font-light">
          <p className="font-medium text-stone-900 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-stone-700" /> Couture Tailoring Standards:
          </p>
          <p className="text-[11px] leading-relaxed">
            All GulPash ready-to-wear ensembles are hand-finished with premium seam allowances (up to 1.5 inches) for personalized fitting adjustments.
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-stone-500 font-light">
            Need custom tailoring or altered sleeve lengths? Inquire directly on WhatsApp!
          </p>
        </div>

      </div>
    </div>
  );
};
