import { CreatePostDto } from '@/dtos/post.dto';
import { HttpException } from '@exceptions/HttpException';
import { Post } from '@/interfaces/post.interface';
import postModel from '@/models/post.model';
import { isEmpty } from '@utils/util';

class PostService {
  public post = postModel;

  public async findAllPost(): Promise<Post[]> {
    const posts: Post[] = await this.post.find();
    return posts;
  }

  public async findPostById(postId: string): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');

    const findPost: Post = await this.post.findOne({ _id: postId });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    return findPost;
  }

  public async createPost(postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const createPostData: Post = await this.post.create({ ...postData });

    return createPostData;
  }

  public async updatePost(postId: string, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const updatePostById: Post = await this.post.findByIdAndUpdate(postId, postData, { new: true });
    if (!updatePostById) throw new HttpException(409, "Post doesn't exist");

    return updatePostById;
  }

  public async deletePost(postId: string): Promise<Post> {
    const deletePostById: Post = await this.post.findByIdAndDelete(postId);
    if (!deletePostById) throw new HttpException(409, "Post doesn't exist");

    return deletePostById;
  }
}

export default PostService;
