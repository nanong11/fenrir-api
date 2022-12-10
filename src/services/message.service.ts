import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Message } from '@interfaces/message.interface';
import messageModel from '@/models/message.model';
import { CreateMessageDto, UpdateMessageDto } from '@/dtos/message.dto';

class MessageService {
  public message = messageModel;

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

  public async createMessage(messageData: CreateMessageDto): Promise<Message> {
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');

    const createMessage: Message = await this.message.create({ ...messageData });

    return createMessage;
  }

  public async updateMessage(messageId: string, messageData: UpdateMessageDto): Promise<Message> {
    if (isEmpty(messageId)) throw new HttpException(400, 'messageId is empty');
    if (isEmpty(messageData)) throw new HttpException(400, 'messageData is empty');

    const updateMessageById: Message = await this.message.findByIdAndUpdate(messageId, messageData, { new: true });
    if (!updateMessageById) throw new HttpException(409, "updateMessageById doesn't exist");

    return updateMessageById;
  }

  public async deleteMessage(messageId: string): Promise<Message> {
    const deleteMessageById: Message = await this.message.findByIdAndDelete(messageId);
    if (!deleteMessageById) throw new HttpException(409, "deleteMessageById doesn't exist");

    return deleteMessageById;
  }
}

export default MessageService;
