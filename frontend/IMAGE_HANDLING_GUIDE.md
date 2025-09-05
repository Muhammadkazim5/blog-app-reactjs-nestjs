# Image Handling Guide for React Blog Frontend

This guide explains how images are handled in the React frontend of your blog application.

## Overview

The image handling system consists of several components and utilities that provide:
- **Image Upload**: Drag-and-drop file upload with validation
- **Image Display**: Error handling and fallbacks for broken images
- **Image Utilities**: Helper functions for validation and URL generation
- **Environment Configuration**: Configurable image URLs

## Components

### 1. ImageUpload Component (`src/components/ImageUpload.tsx`)

A comprehensive image upload component with the following features:

#### Features:
- **Drag & Drop**: Users can drag files directly onto the upload area
- **File Validation**: Validates file type and size before upload
- **Image Preview**: Shows preview of selected image before upload
- **Error Handling**: Displays validation errors clearly
- **File Information**: Shows file name, size, and type

#### Usage:
```tsx
import ImageUpload from '../components/ImageUpload';

<ImageUpload
  onImageSelect={(file) => setSelectedImage(file)}
  currentImage={existingImagePath}
  className="max-w-md"
/>
```

#### Props:
- `onImageSelect`: Callback function called when an image is selected
- `currentImage`: Optional existing image path to display
- `className`: Optional CSS classes for styling

### 2. ImageDisplay Component (`src/components/ImageDisplay.tsx`)

A robust image display component with error handling:

#### Features:
- **Loading States**: Shows loading indicator while image loads
- **Error Fallbacks**: Displays fallback UI when images fail to load
- **Lazy Loading**: Images load only when needed
- **Environment URLs**: Uses configurable base URLs

#### Usage:
```tsx
import ImageDisplay from '../components/ImageDisplay';

<ImageDisplay
  imagePath={post.image}
  alt={post.title}
  className="h-48 w-full"
/>
```

#### Props:
- `imagePath`: The image filename/path from the backend
- `alt`: Alt text for accessibility
- `className`: CSS classes for styling
- `fallbackIcon`: Optional custom fallback icon
- `onError`: Optional error callback

## Utilities

### Image Utilities (`src/utils/imageUtils.ts`)

Helper functions for image handling:

#### Functions:

1. **`getImageUrl(imagePath: string)`**
   - Generates full URL for an image
   - Uses environment variable for base URL

2. **`validateImageFile(file: File)`**
   - Validates image file type and size
   - Returns validation result with error message

3. **`createImagePreview(file: File)`**
   - Creates preview URL for uploaded file
   - Returns Promise with data URL

4. **`formatFileSize(bytes: number)`**
   - Formats file size in human-readable format
   - Returns string like "2.5 MB"

5. **`getImageDimensions(file: File)`**
   - Gets image dimensions
   - Returns Promise with width and height

## Environment Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_UPLOADS_URL=http://localhost:3000/uploads
```

### Usage in Code:
```typescript
const imageUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000/uploads';
```

## Backend Integration

### File Upload Process:

1. **Frontend**: User selects image using `ImageUpload` component
2. **Validation**: Client-side validation checks file type and size
3. **FormData**: Image is sent as FormData with `multipart/form-data` content type
4. **Backend**: NestJS handles file upload using Multer
5. **Storage**: File is saved to `./uploads` directory with random filename
6. **Database**: Filename is stored in the database
7. **Display**: Images are served statically from `/uploads/` endpoint

### API Integration:

```typescript
// In api.ts
create: async (data: CreatePostDto, image?: File): Promise<Post> => {
  if (image) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('image', image);

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  // ... regular JSON request
}
```

## Implementation Examples

### 1. Creating a Post with Image

```tsx
const [selectedImage, setSelectedImage] = useState<File | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await postApi.create(formData, selectedImage || undefined);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// In JSX
<ImageUpload
  onImageSelect={setSelectedImage}
  className="max-w-md"
/>
```

### 2. Displaying Post Images

```tsx
{post.image && (
  <div className="mb-4">
    <ImageDisplay
      imagePath={post.image}
      alt={post.title}
      className="h-48 w-full"
    />
  </div>
)}
```

### 3. Custom Error Handling

```tsx
<ImageDisplay
  imagePath={post.image}
  alt={post.title}
  className="h-48 w-full"
  onError={() => console.log('Image failed to load')}
  fallbackIcon={<CustomIcon />}
/>
```

## Best Practices

### 1. File Validation
- Always validate file type and size on the client side
- Provide clear error messages for validation failures
- Set reasonable file size limits (e.g., 5MB)

### 2. Error Handling
- Always provide fallback UI for failed image loads
- Use loading states to improve user experience
- Log errors for debugging purposes

### 3. Performance
- Use lazy loading for images below the fold
- Optimize images before upload when possible
- Consider using WebP format for better compression

### 4. Accessibility
- Always provide meaningful alt text
- Ensure images don't break layout when they fail to load
- Use proper ARIA labels for interactive elements

### 5. Security
- Validate file types on both client and server
- Sanitize filenames to prevent path traversal
- Consider scanning uploaded images for malware

## File Structure

```
frontend/src/
├── components/
│   ├── ImageUpload.tsx      # Image upload component
│   └── ImageDisplay.tsx     # Image display component
├── utils/
│   └── imageUtils.ts        # Image utility functions
├── pages/
│   ├── Posts.tsx            # Uses ImageUpload and ImageDisplay
│   ├── PostDetail.tsx       # Uses ImageDisplay
│   └── UserDetail.tsx       # Uses ImageDisplay
└── services/
    └── api.ts               # API integration for file uploads
```

## Troubleshooting

### Common Issues:

1. **Images not loading**
   - Check if backend is serving static files correctly
   - Verify environment variables are set
   - Check browser network tab for 404 errors

2. **Upload failures**
   - Verify file size is within limits
   - Check file type is supported
   - Ensure backend has proper CORS configuration

3. **Validation errors**
   - Check file type against allowed types
   - Verify file size is under limit
   - Ensure file is not corrupted

### Debug Tips:

1. **Check Network Tab**: Look for failed requests in browser dev tools
2. **Console Logs**: Check for JavaScript errors in console
3. **Backend Logs**: Check NestJS logs for upload errors
4. **File Permissions**: Ensure uploads directory is writable

## Future Enhancements

Consider implementing these features:

1. **Image Resizing**: Resize images on upload for better performance
2. **Multiple Images**: Support multiple image uploads per post
3. **Image Gallery**: Create image gallery components
4. **CDN Integration**: Use CDN for image delivery
5. **Image Optimization**: Implement WebP conversion
6. **Thumbnail Generation**: Create thumbnails for faster loading
