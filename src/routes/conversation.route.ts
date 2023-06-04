import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ConversationController from '@/controllers/conversation.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversation.dto';
import validationMiddleware from '@middlewares/validation.middleware';

class ConversationRoute implements Routes {
  public path = '/conversation';
  public router = Router();
  public conversationController = new ConversationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.conversationController.findAllConversation);
    this.router.get(
      `${this.path}/:conversationId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      this.conversationController.findConversationById,
    );
    this.router.get(
      `${this.path}/find_conversation_by_userid/:userId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      this.conversationController.findConversationByUserId,
    );
    this.router.post(
      `${this.path}/create`,
      authMiddleware,
      validationMiddleware(CreateConversationDto, 'body'),
      this.conversationController.createConversation,
    );
    this.router.put(
      `${this.path}/update/:conversationId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      validationMiddleware(UpdateConversationDto, 'body', true),
      this.conversationController.updateConversation,
    );
    this.router.put(
      `${this.path}/add_participant/:conversationId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      validationMiddleware(UpdateConversationDto, 'body', true),
      this.conversationController.addParticipant,
    );
    this.router.put(
      `${this.path}/remove_participant/:conversationId`,
      authMiddleware,
      validationMiddleware(String, 'params'),
      validationMiddleware(UpdateConversationDto, 'body', true),
      this.conversationController.removeParticipant,
    );
    this.router.delete(
      `${this.path}/delete/:conversationId`,
      validationMiddleware(String, 'params'),
      authMiddleware,
      this.conversationController.deleteConversation,
    );
  }
}

export default ConversationRoute;
