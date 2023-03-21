import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, SOCKETIO_PORT } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { Server } from 'socket.io';
import http from 'http';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public socketioPort: number;
  public server: Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.socketioPort = Number(SOCKETIO_PORT) || 3001;
    this.server = new Server(http.createServer(this.app), { cors: { origin: ORIGIN } });

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeSocketIo();
  }

  public listen() {
    this.server.listen(this.socketioPort);
    this.app.listen(this.port, () => {
      logger.info(`=============================================`);
      logger.info(`============ ENV: ${this.env} ===============`);
      logger.info(`======= WELCOME TO ANDVARI SERVER ===========`);
      logger.info(`===== 🚀 App listening on the port ${this.port} =====`);
      logger.info(`== 🚀 Sokcet.io listening on the port ${this.socketioPort} ==`);
      logger.info(`=============================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    if (dbConnection.url) {
      connect(dbConnection.url);
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSocketIo() {
    this.server.on('connection', socket => {
      console.log(`SocketId ${socket.id} connected`);

      socket.on('join_conversation', data => {
        socket.join(data._id);
      });

      socket.on('send_message', data => {
        socket.to(data.conversationId).emit('incoming_message', data);
      });

      socket.on('received_message', data => {
        socket.to(data.conversationId).emit('notify_received_message', data);
      });

      socket.on('viewed_message', data => {
        socket.to(data.conversationId).emit('notify_viewed_message', data);
      });

      socket.on('disconnect', () => {
        console.log(`SocketId ${socket.id} disconnected`);
      });
    });
  }
}

export default App;
