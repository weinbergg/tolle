"use client";

import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatPrice, scrollToSection } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

const accentStyles: Record<Product["accent"], string> = {
  black:
    "from-void via-graphite to-bronze-dark border-bronze/30",
  silver:
    "from-graphite via-zinc-800/50 to-zinc-900 border-zinc-500/30",
  bronze:
    "from-bronze-dark via-graphite to-void border-bronze/40",
  custom:
    "from-bronze-dark/80 via-graphite to-void border-bronze-light/20",
};

function ProductVisual({ accent }: { accent: Product["accent"] }) {
  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-bronze/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="relative">
        <div
          className={cn(
            "relative h-32 w-32 rounded-full border-2 bg-gradient-to-br shadow-2xl transition-transform duration-700 group-hover:scale-105 md:h-40 md:w-40",
            accentStyles[accent]
          )}
        >
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-void/90 via-graphite/80 to-transparent">
            <div className="absolute left-1/4 top-1/4 h-1/4 w-1/4 rounded-full bg-bronze-light/10 blur-md" />
          </div>
          {accent === "custom" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-2xl text-bronze-light/40">?</span>
            </div>
          )}
        </div>
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1 rounded-full border border-bronze/40 bg-bronze-dark" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const handleOrder = () => {
    scrollToSection("contact");
    setTimeout(() => {
      const select = document.getElementById("product-select") as HTMLSelectElement;
      if (select) {
        select.value = product.id;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="glass-card group flex flex-col overflow-hidden transition-all duration-500 hover:border-bronze/40"
    >
      <ProductVisual accent={product.accent} />
      <div className="flex flex-1 flex-col p-8">
        <h3 className="mb-3 font-serif text-2xl text-warm">{product.name}</h3>
        <dl className="mb-4 space-y-1 text-sm text-warm/50">
          <div className="flex gap-2">
            <dt className="text-bronze/60">Материал:</dt>
            <dd>{product.material}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-bronze/60">Размер:</dt>
            <dd>{product.size}</dd>
          </div>
        </dl>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-warm/60">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-4 border-t border-bronze/10 pt-6">
          <span className="font-serif text-xl text-bronze-light">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleOrder}
            className="btn-primary px-6 py-3 text-xs"
            aria-label={`Оставить заявку на ${product.name}`}
          >
            Оставить заявку
          </button>
        </div>
      </div>
    </motion.article>
  );
}
