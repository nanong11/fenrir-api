import { NextFunction, Request, Response } from 'express';
import { Message } from '@interfaces/message.interface';
import messageService from '@/services/message.service';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/message.dto';

class MessageController {
  public messageService = new messageService();

  public findAllMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllMessage: Message[] = await this.messageService.findAllMessage();

      res.status(200).json({ data: findAllMessage, message: 'findAllMessage' });
    } catch (error) {
      next(error);
    }
  };

  public findMessageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId: string = req.params.messageId;
      const findMessageById: Message = await this.messageService.findMessageById(messageId);

      res.status(200).json({ data: findMessageById, message: 'findMessageById' });
    } catch (error) {
      next(error);
    }
  };

  public findAllMessageByConversationId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId: string = req.params.conversationId;
      const findAllMessageByConversationId: Message[] = await this.messageService.findAllMessageByConversationId(conversationId);

      res.status(200).json({ data: findAllMessageByConversationId, message: 'findAllMessageByConversationId' });
    } catch (error) {
      next(error);
    }
  };

  public createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageData: CreateMessageDto = req.body;
      const createMessage: Message = await this.messageService.createMessage(messageData);

      res.status(201).json({ data: createMessage, message: 'createdMessage' });
    } catch (error) {
      next(error);
    }
  };

  public updateMessageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId: string = req.params.messageId;
      const messageData: UpdateMessageDto = req.body;
      const updateMessageById: Message = await this.messageService.updateMessageById(messageId, messageData);

      res.status(200).json({ data: updateMessageById, message: 'updateMessageById' });
    } catch (error) {
      next(error);
    }
  };

  public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId: string = req.params.messageId;
      const deleteMessage: Message = await this.messageService.deleteMessage(messageId);

      res.status(200).json({ data: deleteMessage, message: 'deletedMessage' });
    } catch (error) {
      next(error);
    }
  };
}

export default MessageController;
