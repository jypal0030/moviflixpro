import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('Upload request received:', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size
    });
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // For Vercel, we'll return a placeholder URL
    // In production, you'd use a service like Vercel Blob or AWS S3
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}.${file.name.split('.').pop()}`;
    
    // Return a placeholder URL (in production, upload to actual storage)
    const fileUrl = `https://via.placeholder.com/300x450?text=${encodeURIComponent(filename)}`;
    
    console.log('File processed:', { filename, fileUrl });
    
    return NextResponse.json({
      message: 'File processed successfully',
      url: fileUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error.message },
      { status: 500 }
    );
  }
}