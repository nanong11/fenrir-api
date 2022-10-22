import { CreatePostDto } from '@/dtos/post.dto';
import { HttpException } from '@exceptions/HttpException';
import { Post } from '@/interfaces/post.interface';
import postModel from '@/models/post.model';
import { isEmpty } from '@utils/util';
import { UpdateWishPostDto } from '@/dtos/wish.dto';

class PostService {
  public post = postModel;

  public async findAllPost(): Promise<Post[]> {
    const posts: Post[] = await this.post.find();
    return posts;
  }

  public async findAllPostCount(): Promise<any> {
    const postsCount: any = await this.post.count({ active: true });
    return postsCount;
  }

  public async findPostById(postId: string): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');

    const findPost: Post = await this.post.findOne({ _id: postId, active: true });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    return findPost;
  }

  public async loadPost(oldestPostCreatedAt: any): Promise<Post[]> {
    const posts: Post[] = await this.post
      .find({ createdAt: { $lt: oldestPostCreatedAt }, active: true })
      .sort({ createdAt: -1 })
      .limit(10);
    return posts;
  }

  public async loadPostByUserId(userId: string, oldestPostCreatedAt: any): Promise<Post[]> {
    const posts: Post[] = await this.post
      .find({ userId, createdAt: { $lt: oldestPostCreatedAt }, active: true })
      .sort({ createdAt: -1 })
      .limit(10);
    return posts;
  }

  public async getAllPostCountByUserId(userId: string): Promise<any> {
    const postsCount: any = await this.post.count({ userId, active: true });
    return postsCount;
  }

  public async createPost(postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const createPostData: Post = await this.post.create({ ...postData });

    return createPostData;
  }

  public async loadPostByUserIdInWishes(userId: string, oldestPostCreatedAt: any): Promise<Post[]> {
    const posts: Post[] = await this.post
      .find({ createdAt: { $lt: oldestPostCreatedAt }, wishes: { $elemMatch: { userId } }, active: true })
      .sort({ createdAt: -1 })
      .limit(10);
    return posts;
  }

  public async getAllPostCountByUserIdInWishes(userId: string): Promise<any> {
    const postsCount: any = await this.post.count({ wishes: { $elemMatch: { userId } }, active: true });
    return postsCount;
  }

  public async updatePost(postId: string, postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const updatePostById: Post = await this.post.findByIdAndUpdate(postId, postData, { new: true });
    if (!updatePostById) throw new HttpException(409, "Post doesn't exist");

    return updatePostById;
  }

  public async updateWishPostById(postId: string, postWishData: UpdateWishPostDto): Promise<Post> {
    if (isEmpty(postWishData)) throw new HttpException(400, 'postData is empty');

    const findPost: Post = await this.post.findOne({ _id: postId, active: true });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    const wishExist: any = findPost.wishes.find(
      (wish: { userId: string; firstName: string; lastName: string }) => wish.userId === postWishData.userId,
    );

    if (wishExist) {
      const updateWishPostById: Post = await this.post.findByIdAndUpdate(postId, { $pull: { wishes: { userId: wishExist.userId } } }, { new: true });

      return updateWishPostById;
    } else {
      const updateWishPostById: Post = await this.post.findByIdAndUpdate(postId, { $push: { wishes: postWishData } }, { new: true });

      return updateWishPostById;
    }
  }

  public async deletePost(postId: string): Promise<Post> {
    const deletePostById: Post = await this.post.findByIdAndDelete(postId);
    if (!deletePostById) throw new HttpException(409, "Post doesn't exist");

    return deletePostById;
  }
}

export default PostService;
