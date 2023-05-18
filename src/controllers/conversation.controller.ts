import { NextFunction, Request, Response } from 'express';
import { Conversation } from '@interfaces/conversation.interface';
import ConversationService from '@/services/conversation.service';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversation.dto';

class ConversationController {
  public conversationService = new ConversationService();

  public findAllConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllConversation: Conversation[] = await this.conversationService.findAllConversation();

      res.status(200).json({ data: findAllConversation, message: 'findAllConversation' });
    } catch (error) {
      next(error);
    }
  };

  public findConversationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.conversationId;
      const findConversationById: Conversation = await this.conversationService.findConversationById(conversationId);

      res.status(200).json({ data: findConversationById, message: 'findConversationById' });
    } catch (error) {
      next(error);
    }
  };

  public findConversationByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.userId;
      const findConversationByUserId: Conversation[] = await this.conversationService.findConversationByUserId(userId);

      res.status(200).json({ data: findConversationByUserId, message: 'findConversationByUserId' });
    } catch (error) {
      next(error);
    }
  };

  public createConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationData: CreateConversationDto = req.body;
      const createConversation = await this.conversationService.createConversation(conversationData);

      res.status(201).json({ data: createConversation, message: 'createConversation' });
    } catch (error) {
      next(error);
    }
  };

  public updateConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.conversationId;
      const conversationData: UpdateConversationDto = req.body;
      const updateConversation: Conversation = await this.conversationService.updateConversation(conversationId, conversationData);

      res.status(200).json({ data: updateConversation, message: 'updateConversation' });
    } catch (error) {
      next(error);
    }
  };

  public addParticipant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.conversationId;
      const conversationData: UpdateConversationDto = req.body;
      const updateConversation: Conversation = await this.conversationService.addParticipant(conversationId, conversationData);

      res.status(200).json({ data: updateConversation, message: 'addParticipant' });
    } catch (error) {
      next(error);
    }
  };

  public deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.conversationId;
      const deleteConversation: Conversation = await this.conversationService.deleteConversation(conversationId);

      res.status(200).json({ data: deleteConversation, message: 'deleteConversation' });
    } catch (error) {
      next(error);
    }
  };
}

export default ConversationController;
