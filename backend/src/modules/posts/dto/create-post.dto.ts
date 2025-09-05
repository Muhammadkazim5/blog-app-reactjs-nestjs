import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  // userId will be set automatically from authenticated user
  @IsOptional()
  @IsNumber()
  userId?: number;
}
