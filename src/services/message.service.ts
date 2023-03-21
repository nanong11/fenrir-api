import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Message } from '@interfaces/message.interface';
import messageModel from '@/models/message.model';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/message.dto';
import { Conversation } from '@interfaces/conversation.interface';
import ConversationService from '@/services/conversation.service';

class MessageService {
  public message = messageModel;
  public conversationService = new ConversationService();

  public async findAllMessage(): Promise<Message[]> {
    const allMessage: Message[] = await this.message.find();
    return allMessage;
  }

  public async findMessageById(messageId: string): Promise<Message> {
    if (isEmpty(messageId)) throw new HttpException(400, 'messageId is empty');

    const message: Message = await this.message.findOne({ _id: messageId });
    if (!message) throw new HttpException(409, "message doesn't exist");

    return message;
  }

  public async findAllMessageByConversationId(conversationId: string): Promise<Message[]> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');

    const findConversationById: Conversation = await this.conversationService.findConversationById(conversationId);
    if (isEmpty(findConversationById)) throw new HttpException(400, 'conversation not exist');

    const findAllMessageByConversationId: Message[] = await this.message.find({ conversationId: conversationId, isDeleted: false });
    if (!findAllMessageByConversationId) throw new HttpException(409, 'findAllMessageByConversationId failed');

    return findAllMessageByConversationId;
  }

  public async createMessage(messageData: CreateMessageDto): Promise<Message> {
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');

    // const findConversationById: Conversation = await this.conversationService.findConversationById(messageData.conversationId);
    // if (!findConversationById) throw new HttpException(409, "conversation doesn't exist");

    // const participants: Array<any> = findConversationById.participants;
    // const isExist = participants.find(participant => participant.userId === messageData.userId);
    // if (isEmpty(isExist)) throw new HttpException(400, 'user is not a participant of the conversation');

    const createMessage: Message = await this.message.create({ ...messageData });
    if (isEmpty(createMessage)) throw new HttpException(400, 'create message failed');

    const message: Message = await this.message.findOne({ _id: createMessage._id });
    return message;
  }

  public async updateMessageById(messageId: string, messageData: UpdateMessageDto): Promise<Message> {
    if (isEmpty(messageId)) throw new HttpException(400, 'messageId is empty');
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');

    const updateMessageById: Message = await this.message.findByIdAndUpdate(messageId, messageData, { new: true });
    if (!updateMessageById) throw new HttpException(409, 'updateMessageById failed');

    return updateMessageById;
  }

  public async deleteMessage(messageId: string): Promise<Message> {
    const deleteMessageById: Message = await this.message.findByIdAndDelete(messageId);
    if (!deleteMessageById) throw new HttpException(409, "deleteMessageById doesn't exist");

    return deleteMessageById;
  }
}

export default MessageService;
