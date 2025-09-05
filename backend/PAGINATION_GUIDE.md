# Posts Module Pagination Implementation

This guide explains how pagination has been implemented in the Posts module of the NestJS backend.

## Overview

Pagination has been added to the Posts module to handle large datasets efficiently. The implementation uses TypeORM's built-in pagination features and provides a consistent API across all endpoints that return lists of posts.

## Files Modified/Created

### New Files
- `src/modules/posts/dto/pagination.dto.ts` - Pagination DTOs and response wrapper
- `pagination-examples.http` - HTTP request examples for testing pagination
- `PAGINATION_GUIDE.md` - This documentation file

### Modified Files
- `src/modules/posts/posts.service.ts` - Added pagination support to service methods
- `src/modules/posts/posts.controller.ts` - Added query parameter handling for pagination

## Implementation Details

### 1. Pagination DTOs

#### PaginationDto
```typescript
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;
}
```

**Features:**
- `page`: Page number (default: 1, minimum: 1)
- `limit`: Number of items per page (default: 10, minimum: 1)
- Automatic validation using class-validator decorators
- Type transformation from string to number for query parameters

#### PaginatedResponseDto
```typescript
export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

**Features:**
- Generic type support for any data type
- Complete pagination metadata
- Helper properties for frontend navigation

### 2. Service Layer Updates

#### findAll Method
```typescript
async findAll(
  paginationDto?: PaginationDto,
): Promise<PaginatedResponseDto<Post>> {
  const { page = 1, limit = 10 } = paginationDto || {};
  const skip = (page - 1) * limit;

  const [posts, total] = await this.postsRepository.findAndCount({
    relations: ['author', 'comments', 'comments.user'],
    skip,
    take: limit,
    order: { id: 'DESC' }, // Order by newest first
  });

  return new PaginatedResponseDto(posts, total, page, limit);
}
```

#### findByUser Method
```typescript
async findByUser(
  userId: number,
  paginationDto?: PaginationDto,
): Promise<PaginatedResponseDto<Post>> {
  const { page = 1, limit = 10 } = paginationDto || {};
  const skip = (page - 1) * limit;

  const [posts, total] = await this.postsRepository.findAndCount({
    where: { author: { id: userId } },
    relations: ['author', 'comments', 'comments.user'],
    skip,
    take: limit,
    order: { id: 'DESC' }, // Order by newest first
  });

  return new PaginatedResponseDto(posts, total, page, limit);
}
```

**Key Features:**
- Uses TypeORM's `findAndCount` for efficient pagination
- Maintains all existing relations (author, comments, comments.user)
- Orders results by ID descending (newest first)
- Optional pagination parameter with sensible defaults

### 3. Controller Layer Updates

#### Updated Endpoints
```typescript
@Get()
findAll(@Query() paginationDto: PaginationDto) {
  return this.postsService.findAll(paginationDto);
}

@Get('user/:userId')
findByUser(
  @Param('userId', ParseIntPipe) userId: number,
  @Query() paginationDto: PaginationDto,
) {
  return this.postsService.findByUser(userId, paginationDto);
}
```

**Features:**
- Automatic query parameter parsing and validation
- Backward compatible (works without pagination parameters)
- Clean separation of concerns

## API Usage Examples

### Basic Pagination
```http
GET /posts?page=1&limit=10
```

### Default Values
```http
GET /posts
# Equivalent to: GET /posts?page=1&limit=10
```

### User Posts with Pagination
```http
GET /posts/user/1?page=2&limit=5
```

### Response Format
```json
{
  "data": [
    {
      "id": 1,
      "title": "Sample Post",
      "content": "This is a sample post content",
      "image": "image-filename.jpg",
      "author": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "comments": [
        {
          "id": 1,
          "content": "Great post!",
          "user": {
            "id": 2,
            "username": "jane_doe"
          }
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "hasNext": true,
  "hasPrev": false
}
```

## Validation Rules

### Page Parameter
- Must be an integer
- Minimum value: 1
- Default: 1
- Invalid values will result in validation errors

### Limit Parameter
- Must be a positive integer
- Minimum value: 1
- Default: 10
- Invalid values will result in validation errors

## Performance Considerations

1. **Database Efficiency**: Uses TypeORM's `findAndCount` which executes optimized SQL queries
2. **Memory Usage**: Only loads the requested page of data into memory
3. **Indexing**: Consider adding database indexes on frequently queried columns (e.g., `author.id`, `created_at`)
4. **Caching**: Consider implementing Redis caching for frequently accessed pages

## Future Enhancements

1. **Sorting**: Add support for custom sorting (by date, title, etc.)
2. **Filtering**: Add support for filtering posts by criteria
3. **Search**: Implement full-text search with pagination
4. **Cursor-based Pagination**: For very large datasets, consider cursor-based pagination
5. **Caching**: Implement Redis caching for improved performance

## Testing

Use the provided `pagination-examples.http` file to test the pagination functionality:

1. Test basic pagination
2. Test edge cases (invalid parameters)
3. Test user-specific pagination
4. Verify response format and metadata

## Migration Notes

This implementation is **backward compatible**. Existing API calls without pagination parameters will continue to work with default pagination values (page=1, limit=10).

The response format has changed from a simple array to a paginated response object. Frontend applications will need to be updated to handle the new response structure.
