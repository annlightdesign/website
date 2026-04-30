const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database backup...");
  
  try {
    const products = await prisma.product.findMany();
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    const projects = await prisma.project.findMany();
    const users = await prisma.user.findMany();
    const siteSettings = await prisma.siteSetting.findMany();
    const architectLeads = await prisma.architectLead.findMany();
    const visitorLogs = await prisma.visitorLog.findMany();
    
    // In many-to-many relationships (like Product <-> Category), we need to capture the relations.
    // Let's get the products with their category connections
    const productsWithCategories = await prisma.product.findMany({
      include: {
        categories: true
      }
    });

    const categoriesWithHierarchy = await prisma.category.findMany({
      include: {
        parent: true
      }
    });

    const backup = {
      products: productsWithCategories,
      categories: categoriesWithHierarchy,
      brands,
      projects,
      users,
      siteSettings,
      architectLeads,
      visitorLogs,
    };

    fs.writeFileSync('database_backup.json', JSON.stringify(backup, null, 2));
    console.log("Backup complete! Saved to database_backup.json");
    
  } catch (error) {
    console.error("Backup failed. The database might still be locked up with connections:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
