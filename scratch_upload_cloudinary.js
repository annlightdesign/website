const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
envContent.split(/\r?\n/).forEach(line => {
  if (!line || line.startsWith('#')) return;
  const eqIdx = line.indexOf('=');
  if (eqIdx !== -1) {
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[key] = val;
  }
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key:', process.env.CLOUDINARY_API_KEY);
// console.log('API secret:', process.env.CLOUDINARY_API_SECRET);

const folderPath = 'C:\\Users\\My Pc\\Desktop\\good';

async function uploadImages() {
  try {
    const files = fs.readdirSync(folderPath);
    let count = 0;
    
    for (const file of files) {
      const ext = path.extname(file);
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext.toLowerCase())) {
        const filePath = path.join(folderPath, file);
        const fileNameWithoutExt = path.basename(file, ext);
        
        console.log(`Uploading ${file}...`);
        
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'annlights_products',
          public_id: fileNameWithoutExt,
          overwrite: true,
          invalidate: true,
          resource_type: 'image'
        });
        
        console.log(`Uploaded ${file} -> ${result.secure_url}`);
        count++;
      }
    }
    
    console.log(`Successfully replaced ${count} images on Cloudinary.`);
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

uploadImages();
