import React from 'react';
import { ShoppingBag, Lock, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';
import { getStatusBadge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onQuickBuy: (p: Product) => void;
  onQuickReserve: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickBuy,
  onQuickReserve,
}) => {
  const reservationPercent = Math.round((product.reservedStock / (product.totalStock || 1)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Top Image & Badge */}
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 right-2.5">
          {getStatusBadge(product.status)}
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/20">
            {product.sku}
          </span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{product.category}</span>
            <span className="text-amber-400 font-semibold">★ {product.rating}</span>
          </div>

          <h4
            onClick={() => onSelect(product)}
            className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors cursor-pointer"
          >
            {product.name}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Stock Availability Metric & Progress */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-500">Available:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {product.availableStock} / {product.totalStock}
            </span>
          </div>

          {/* Dual bar: Available (green), Reserved (amber), Sold (slate) */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(product.availableStock / product.totalStock) * 100}%` }}
              title={`Available: ${product.availableStock}`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(product.reservedStock / product.totalStock) * 100}%` }}
              title={`Reserved: ${product.reservedStock}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
            <span>{product.reservedStock} reserved ({reservationPercent}%)</span>
            <span>{product.soldStock} sold</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase">Price</span>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onQuickReserve(product)}
            disabled={product.availableStock <= 0}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-500 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
            title="Lock inventory reservation"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onQuickBuy(product)}
            disabled={product.availableStock <= 0}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs disabled:opacity-30 transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>Buy</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
