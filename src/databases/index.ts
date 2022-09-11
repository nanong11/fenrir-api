import { DB_URL } from '@config';

export const dbConnection = {
  // url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  url: DB_URL,
  // No longer needed for newer version of mongodb
  // options: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // },
};
