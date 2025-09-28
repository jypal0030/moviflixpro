import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const projectRoot = process.cwd()
    const zipPath = path.join(projectRoot, 'temp-website.zip')
    
    // Create zip using system command (more reliable)
    try {
      // Remove existing zip if it exists
      execSync(`rm -f "${zipPath}"`, { stdio: 'pipe' })
      
      // Create new zip excluding unnecessary directories
      execSync(`cd "${projectRoot}" && zip -r "${zipPath}" . -x "node_modules/*" ".git/*" ".next/*" "temp-website.zip"`, { 
        stdio: 'pipe',
        maxBuffer: 50 * 1024 * 1024 // 50MB buffer
      })
      
      // Read the created zip file
      const zipBuffer = await fs.readFile(zipPath)
      
      // Clean up temp file
      await fs.unlink(zipPath)
      
      // Return the zip file
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="movieflix-pro-website-updated.zip"',
          'Content-Length': zipBuffer.length.toString(),
        },
      })
      
    } catch (error) {
      console.error('System zip command failed:', error)
      throw new Error('Failed to create zip using system command')
    }
    
  } catch (error) {
    console.error('Error creating zip file:', error)
    return NextResponse.json(
      { error: 'Failed to create zip file', details: error.message },
      { status: 500 }
    )
  }
}