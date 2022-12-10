import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import MessageController from '@/controllers/message.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/message.dto';
import validationMiddleware from '@middlewares/validation.middleware';

class MessageRoute implements Routes {
  public path = '/message';
  public router = Router();
  public messageController = new MessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.messageController.findAllMessage);
    this.router.get(`${this.path}/:messageId`, authMiddleware, validationMiddleware(String, 'params'), this.messageController.findMessageById);
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreateMessageDto, 'body'), this.messageController.createMessage);
    this.router.put(
      `${this.path}/update/:messageId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      validationMiddleware(UpdateMessageDto, 'body', true),
      this.messageController.updateMessage,
    );
    this.router.delete(
      `${this.path}/delete/:messageId`,
      validationMiddleware(String, 'params'),
      authMiddleware,
      this.messageController.deleteMessage,
    );
  }
}

export default MessageRoute;
