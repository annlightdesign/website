import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';
import CategoryForm from '@/components/CategoryForm';
import CatalogDndManager from '@/components/CatalogDndManager';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
  const allProducts = await prisma.product.findMany({ 
    include: { categories: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] 
  });
  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }]
  });

  // Group products by category
  const productsByCategory = categories.map(cat => ({
    category: cat,
    products: allProducts.filter(p => p.categories.some(c => c.id === cat.id))
  }));

  const uncategorizedProducts = allProducts.filter(p => !p.categories || p.categories.length === 0);

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
        <CatalogDndManager 
          initialCategories={[
            ...productsByCategory,
            ...(uncategorizedProducts.length > 0 ? [{
              category: null,
              products: uncategorizedProducts
            }] : [])
          ]}
        />
      </div>

    </div>
  );
}
