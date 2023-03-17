import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import TestDataRoute from '@routes/testData.route';
import ProvinceRoute from '@routes/province.route';
import PostRoute from '@routes/post.route';
import MessageRoute from '@routes/message.route';
import ConversationRoute from '@routes/conversation.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new TestDataRoute(),
  new ProvinceRoute(),
  new PostRoute(),
  new MessageRoute(),
  new ConversationRoute(),
]);

app.listen();
