"use client";

import { motion } from "framer-motion";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function Collection() {
  return (
    <section
      id="collection"
      className="section-padding relative bg-graphite/30"
      aria-labelledby="collection-heading"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-label mb-4">Коллекция</p>
            <h2 id="collection-heading" className="heading-section text-warm">
              Изделия мастерской
            </h2>
          </div>
          <p className="text-body max-w-md">
            Каждая модель — авторская работа с уникальным характером металла и
            поверхности.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
