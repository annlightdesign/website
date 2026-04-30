const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database restore...");
  
  try {
    const rawData = fs.readFileSync('database_backup.json', 'utf-8');
    const backup = JSON.parse(rawData);
    
    // Clear existing data in case we are running this multiple times
    console.log("Clearing existing data...");
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.architectLead.deleteMany();
    await prisma.visitorLog.deleteMany();

    // 1. Users
    console.log(`Restoring ${backup.users.length} users...`);
    for (const user of backup.users) {
      await prisma.user.create({ data: user });
    }

    // 2. Brands
    console.log(`Restoring ${backup.brands.length} brands...`);
    for (const brand of backup.brands) {
      await prisma.brand.create({ data: brand });
    }

    // 3. Projects
    console.log(`Restoring ${backup.projects.length} projects...`);
    for (const project of backup.projects) {
      await prisma.project.create({ data: project });
    }

    // 4. Site Settings
    console.log(`Restoring ${backup.siteSettings.length} site settings...`);
    for (const setting of backup.siteSettings) {
      await prisma.siteSetting.create({ data: setting });
    }

    // 5. Architect Leads
    console.log(`Restoring ${backup.architectLeads.length} architect leads...`);
    for (const lead of backup.architectLeads) {
      await prisma.architectLead.create({ data: lead });
    }

    // 6. Visitor Logs
    console.log(`Restoring ${backup.visitorLogs.length} visitor logs...`);
    for (const log of backup.visitorLogs) {
      await prisma.visitorLog.create({ data: log });
    }

    // 7. Categories (Need to handle parent-child hierarchy)
    console.log(`Restoring ${backup.categories.length} categories...`);
    // First pass: create all categories without parents
    for (const cat of backup.categories) {
      const { parent, ...catData } = cat;
      await prisma.category.create({ 
        data: {
          id: catData.id,
          name: catData.name,
          nameHe: catData.nameHe,
          order: catData.order,
          enabled: catData.enabled,
          image: catData.image
        }
      });
    }
    // Second pass: link parents
    for (const cat of backup.categories) {
      if (cat.parentId) {
        await prisma.category.update({
          where: { id: cat.id },
          data: { parentId: cat.parentId }
        });
      }
    }

    // 8. Products (Need to handle Category many-to-many connections)
    console.log(`Restoring ${backup.products.length} products...`);
    for (const product of backup.products) {
      const { categories, ...prodData } = product;
      await prisma.product.create({
        data: {
          id: prodData.id,
          title: prodData.title,
          titleHe: prodData.titleHe,
          description: prodData.description,
          images: prodData.images,
          specifications: prodData.specifications,
          brandId: prodData.brandId,
          order: prodData.order,
          createdAt: prodData.createdAt,
          updatedAt: prodData.updatedAt,
          categories: {
            connect: categories.map(c => ({ id: c.id }))
          }
        }
      });
    }

    // 9. Reset PostgreSQL sequences so auto-increment works correctly for new items
    console.log("Fixing PostgreSQL auto-increment sequences...");
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), coalesce(max(id)+1, 1), false) FROM "Product";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce(max(id)+1, 1), false) FROM "Category";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Brand"', 'id'), coalesce(max(id)+1, 1), false) FROM "Brand";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), coalesce(max(id)+1, 1), false) FROM "Project";`);
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`);

    console.log("Restore complete successfully!");
    
  } catch (error) {
    console.error("Restore failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
