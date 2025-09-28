import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const zip = new JSZip()
    const projectRoot = process.cwd()

    // Function to recursively add files and directories to zip
    const addFilesToZip = async (dirPath: string, zipPath: string) => {
      try {
        const items = await fs.readdir(dirPath, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = path.join(dirPath, item.name)
          const relativePath = path.join(zipPath, item.name)
          
          if (item.isDirectory()) {
            // Skip node_modules, .git, and .next directories
            if (item.name === 'node_modules' || item.name === '.git' || item.name === '.next') {
              continue
            }
            // Recursively add subdirectories
            await addFilesToZip(fullPath, relativePath)
          } else {
            // Add file to zip
            try {
              const fileContent = await fs.readFile(fullPath)
              zip.file(relativePath, fileContent)
            } catch (error) {
              console.warn(`Could not add file ${fullPath}:`, error)
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read directory ${dirPath}:`, error)
      }
    }

    // Add main configuration files
    const configFiles = [
      'package.json',
      'package-lock.json',
      'tailwind.config.ts',
      'tsconfig.json',
      'next.config.js',
      'postcss.config.mjs',
      'eslint.config.mjs',
      'vercel.json',
      'components.json',
      'README.md',
      'deploy.sh'
    ]
    
    for (const file of configFiles) {
      try {
        const filePath = path.join(projectRoot, file)
        const fileContent = await fs.readFile(filePath)
        zip.file(file, fileContent)
      } catch (error) {
        console.warn(`Could not add config file ${file}:`, error)
      }
    }

    // Add src directory
    await addFilesToZip(path.join(projectRoot, 'src'), 'src')

    // Add public directory
    await addFilesToZip(path.join(projectRoot, 'public'), 'public')

    // Add prisma directory
    await addFilesToZip(path.join(projectRoot, 'prisma'), 'prisma')

    // Add db directory
    await addFilesToZip(path.join(projectRoot, 'db'), 'db')

    // Add examples directory
    await addFilesToZip(path.join(projectRoot, 'examples'), 'examples')

    // Add server.ts
    try {
      const serverPath = path.join(projectRoot, 'server.ts')
      const serverContent = await fs.readFile(serverPath)
      zip.file('server.ts', serverContent)
    } catch (error) {
      console.warn('Could not add server.ts:', error)
    }

    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="movieflix-pro-website-updated.zip"',
        'Content-Length': zipBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Error creating zip file:', error)
    return NextResponse.json(
      { error: 'Failed to create zip file', details: error.message },
      { status: 500 }
    )
  }
}