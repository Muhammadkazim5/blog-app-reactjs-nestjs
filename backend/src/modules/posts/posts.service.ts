import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/user.entity';
import { PaginationDto, PaginatedResponseDto } from './dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersRepository.findOne({
      where: { id: createPostDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createPostDto.userId} not found`,
      );
    }

    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      image: createPostDto.image,
      author: user,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Post>> {
    const { page = 1, limit = 5 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['author', 'comments', 'comments.user'],
      skip,
      take: limit,
      order: { id: 'DESC' }, // Order by newest first
    });

    return new PaginatedResponseDto(posts, total, page, limit);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: Partial<CreatePostDto>,
    userId?: number,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Check if user is authorized to update this post
    if (userId && post.author.id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return await this.postsRepository.save(post);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const post = await this.findOne(id);

    // Check if user is authorized to delete this post
    if (userId && post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postsRepository.remove(post);
  }

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
}
