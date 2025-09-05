import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersRepository.findOne({
      where: { id: createCommentDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createCommentDto.userId} not found`,
      );
    }

    const post = await this.postsRepository.findOne({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createCommentDto.postId} not found`,
      );
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      user: user,
      post: post,
    });

    return await this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentsRepository.find({
      relations: ['user', 'post'],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: Partial<CreateCommentDto>,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (updateCommentDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: updateCommentDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateCommentDto.userId} not found`,
        );
      }
      comment.user = user;
    }

    if (updateCommentDto.postId) {
      const post = await this.postsRepository.findOne({
        where: { id: updateCommentDto.postId },
      });

      if (!post) {
        throw new NotFoundException(
          `Post with ID ${updateCommentDto.postId} not found`,
        );
      }
      comment.post = post;
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
    });
  }

  async findByUser(userId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'post'],
    });
  }
}
