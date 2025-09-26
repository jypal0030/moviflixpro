import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }
    
    const projectRoot = process.cwd();
    let filePath: string;
    let fileName: string;
    let contentType: string;
    
    switch (file) {
      case 'nextjs-backup':
        filePath = join(projectRoot, 'moviflixpro-nextjs-backup.tar.gz');
        fileName = 'moviflixpro-nextjs-backup.tar.gz';
        contentType = 'application/gzip';
        break;
      case 'wordpress-theme':
        filePath = join(projectRoot, 'moviflixpro-wordpress-theme.tar.gz');
        fileName = 'moviflixpro-wordpress-theme.tar.gz';
        contentType = 'application/gzip';
        break;
      case 'html-version':
        filePath = join(projectRoot, 'moviflixpro-html-version.tar.gz');
        fileName = 'moviflixpro-html-version.tar.gz';
        contentType = 'application/gzip';
        break;
      default:
        return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
    }
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Return the file as a download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'File not found or could not be read' }, { status: 404 });
  }
}