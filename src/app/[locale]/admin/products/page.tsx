import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';
import CategoryForm from '@/components/CategoryForm';
import AdminCategoryAccordion from '@/components/AdminCategoryAccordion';
import { ArrowLeft } from 'lucide-react';

export default async function AdminProductsPage() {
  const allProducts = await prisma.product.findMany({ 
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] 
  });
  const categories = await prisma.category.findMany();

  // Group products by categoryId
  const productsByCategory = categories.map(cat => ({
    category: cat,
    products: allProducts.filter(p => p.categoryId === cat.id)
  }));

  const uncategorizedProducts = allProducts.filter(p => !p.categoryId);

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 pb-40">
      
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h1 className="text-3xl font-medium tracking-widest uppercase font-sans">Manage Products</h1>
        <div className="flex items-center gap-4">
          <CategoryForm />
          <ProductForm />
        </div>
      </div>

      <div className="mt-10 space-y-2">
        {productsByCategory.map(({ category, products }) => (
          <AdminCategoryAccordion 
            key={category.id} 
            title={category.name} 
            count={products.length}
            products={products}
            defaultOpen={products.length > 0}
          />
        ))}

        {uncategorizedProducts.length > 0 && (
          <AdminCategoryAccordion 
            title="Uncategorized" 
            count={uncategorizedProducts.length}
            products={uncategorizedProducts}
            defaultOpen={true}
          />
        )}
      </div>

    </div>
  );
}
