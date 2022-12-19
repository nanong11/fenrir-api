import { CreatePostDto, UpdatePostDto, UpdateWishPostDto, LoadPostDto, SearchPostDto } from '@/dtos/post.dto';
import { HttpException } from '@exceptions/HttpException';
import { Post, LoadPostData, SearchPostData } from '@/interfaces/post.interface';
import postModel from '@/models/post.model';
import { isEmpty } from '@utils/util';
import { User } from '@/interfaces/users.interface';
import userModel from '@models/users.model';

class PostService {
  public post = postModel;
  public users = userModel;

  public async createPost(postData: CreatePostDto): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const createPostData: Post = await this.post.create({ ...postData });

    return createPostData;
  }

  public async updatePost(postId: string, postData: UpdatePostDto): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');
    if (isEmpty(postData)) throw new HttpException(400, 'postData is empty');

    const updatePostById: Post = await this.post.findByIdAndUpdate(postId, postData, { new: true });
    if (!updatePostById) throw new HttpException(409, "Post doesn't exist");

    return updatePostById;
  }

  public async updateWishPostById(postId: string, postWishData: UpdateWishPostDto): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'postId is empty');
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

  public async loadPost(loadPostDetails: LoadPostDto): Promise<LoadPostData> {
    if (isEmpty(loadPostDetails)) throw new HttpException(400, 'loadPostDetails is empty');

    const { userId, oldestPostCreatedAt, inWishlist } = loadPostDetails;
    let findPostOptions: object = {};
    let findPostCountOptions: object = {};

    if (userId && inWishlist) {
      findPostOptions = { createdAt: { $lt: oldestPostCreatedAt }, wishes: { $elemMatch: { userId } }, active: true };
      findPostCountOptions = { wishes: { $elemMatch: { userId } }, active: true };
    } else if (userId) {
      findPostOptions = { userId, createdAt: { $lt: oldestPostCreatedAt }, active: true };
      findPostCountOptions = { userId, active: true };
    } else {
      findPostOptions = { createdAt: { $lt: oldestPostCreatedAt }, active: true };
      findPostCountOptions = { active: true };
    }

    const postArr: Post[] = await this.post.find(findPostOptions).sort({ createdAt: -1 }).limit(3);
    const postCount: number = await this.post.count(findPostCountOptions);

    const post: Post[] = [];
    if (postArr && postArr.length > 0) {
      for (let i = 0; i < postArr.length; i++) {
        const item: Post = postArr[i];
        const findUser: User = await this.users.findOne({ _id: item.userId, isActive: true });

        if (findUser) {
          item.user = findUser;
          post.push(item);
        }
      }
      return { post, postCount };
    } else {
      return { post, postCount };
    }
  }

  public async searchPost(searchPostDetails: SearchPostDto): Promise<SearchPostData> {
    if (isEmpty(searchPostDetails)) throw new HttpException(400, 'searchPostDetails is empty');

    const { userId, oldestPostCreatedAt, keyWord, inWishlist } = searchPostDetails;
    let findPostOptions: object = {};
    let findPostCountOptions: object = {};
    if (userId && inWishlist) {
      findPostOptions = {
        createdAt: { $lt: oldestPostCreatedAt },
        wishes: { $elemMatch: { userId } },
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
      findPostCountOptions = {
        wishes: { $elemMatch: { userId } },
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
    } else if (userId) {
      findPostOptions = {
        userId,
        createdAt: { $lt: oldestPostCreatedAt },
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
      findPostCountOptions = {
        userId,
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
    } else {
      findPostOptions = {
        createdAt: { $lt: oldestPostCreatedAt },
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
      findPostCountOptions = {
        active: true,
        $or: [
          { title: { $regex: keyWord, $options: 'i' } },
          { description: { $regex: keyWord, $options: 'i' } },
          { category: { $regex: keyWord, $options: 'i' } },
          { 'user.firstName': { $regex: keyWord, $options: 'i' } },
          { 'user.lastName': { $regex: keyWord, $options: 'i' } },
          // { 'user.about': { $regex: keyWord, $options: 'i' } },
          { 'user.address.street': { $regex: keyWord, $options: 'i' } },
          { 'user.address.brgy': { $regex: keyWord, $options: 'i' } },
          { 'user.address.city': { $regex: keyWord, $options: 'i' } },
          { 'user.address.province': { $regex: keyWord, $options: 'i' } },
        ],
      };
    }

    const postArr: Post[] = await this.post.find(findPostOptions).sort({ createdAt: -1 }).limit(3);
    const postCount: number = await this.post.count(findPostCountOptions);

    const post: Post[] = [];
    if (postArr && postArr.length > 0) {
      for (let i = 0; i < postArr.length; i++) {
        const item: Post = postArr[i];
        const findUser: User = await this.users.findOne({ _id: item.userId, isActive: true });

        if (findUser) {
          item.user = findUser;
          post.push(item);
        }
      }
      return { post, postCount };
    } else {
      return { post, postCount };
    }
  }

  public async deletePost(postId: string): Promise<Post> {
    const deletePostById: Post = await this.post.findByIdAndDelete(postId);
    if (!deletePostById) throw new HttpException(409, "Post doesn't exist");

    return deletePostById;
  }
}

export default PostService;
