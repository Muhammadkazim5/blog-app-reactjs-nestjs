import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentAuthDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
