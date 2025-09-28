import JSZip from 'jszip';
import { promises as fs } from 'fs';
import path from 'path';

const zip = new JSZip();
const projectRoot = process.cwd();

// Function to recursively add files
async function addFilesToZip(dirPath, zipPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = path.join(zipPath, item.name);
      
      if (item.isDirectory()) {
        if (item.name === 'node_modules' || item.name === '.git' || item.name === '.next') {
          continue;
        }
        await addFilesToZip(fullPath, relativePath);
      } else {
        try {
          const fileContent = await fs.readFile(fullPath);
          zip.file(relativePath, fileContent);
        } catch (error) {
          console.warn('Could not add file:', fullPath);
        }
      }
    }
  } catch (error) {
    console.warn('Could not read directory:', dirPath);
  }
}

// Add all necessary files and directories
const configFiles = ['package.json', 'package-lock.json', 'tailwind.config.ts', 'tsconfig.json', 'next.config.js', 'postcss.config.mjs', 'eslint.config.mjs', 'vercel.json', 'components.json', 'README.md', 'deploy.sh'];

for (const file of configFiles) {
  try {
    const filePath = path.join(projectRoot, file);
    const fileContent = await fs.readFile(filePath);
    zip.file(file, fileContent);
  } catch (error) {
    console.warn('Could not add config file:', file);
  }
}

await addFilesToZip(path.join(projectRoot, 'src'), 'src');
await addFilesToZip(path.join(projectRoot, 'public'), 'public');
await addFilesToZip(path.join(projectRoot, 'prisma'), 'prisma');
await addFilesToZip(path.join(projectRoot, 'db'), 'db');
await addFilesToZip(path.join(projectRoot, 'examples'), 'examples');

try {
  const serverContent = await fs.readFile(path.join(projectRoot, 'server.ts'));
  zip.file('server.ts', serverContent);
} catch (error) {
  console.warn('Could not add server.ts');
}

// Generate zip file
const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
await fs.writeFile('movieflix-pro-website-fixed.zip', zipBuffer);
console.log('Fixed zip file created successfully!');