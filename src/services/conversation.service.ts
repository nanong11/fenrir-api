import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Conversation } from '@interfaces/conversation.interface';
import conversationModel from '@/models/conversation.model';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversation.dto';

class ConversationService {
  public conversation = conversationModel;

  public async findAllConversation(): Promise<Conversation[]> {
    const allConversation: Conversation[] = await this.conversation.find();
    return allConversation;
  }

  public async findConversationById(conversationId: string): Promise<Conversation> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');

    const conversation: Conversation = await this.conversation.findOne({ _id: conversationId });
    if (!conversation) throw new HttpException(409, "conversation doesn't exist");

    return conversation;
  }

  public async createConversation(conversationData: CreateConversationDto): Promise<Conversation> {
    if (isEmpty(conversationData)) throw new HttpException(400, 'conversationData is empty');
    if (conversationData.participants.length < 2) throw new HttpException(400, 'need 2 or more participants');

    const createConversation: Conversation = await this.conversation.create({ ...conversationData });

    return createConversation;
  }

  public async updateConversation(conversationId: string, conversationData: UpdateConversationDto): Promise<Conversation> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');
    if (isEmpty(conversationData)) throw new HttpException(400, 'conversationData is empty');

    const updateConversation: Conversation = await this.conversation.findByIdAndUpdate(conversationId, conversationData, { new: true });
    if (!updateConversation) throw new HttpException(409, "updateConversation doesn't exist");

    return updateConversation;
  }

  public async deleteConversation(conversationId: string): Promise<Conversation> {
    const deleteConversation: Conversation = await this.conversation.findByIdAndDelete(conversationId);
    if (!deleteConversation) throw new HttpException(409, "deleteConversation doesn't exist");

    return deleteConversation;
  }
}

export default ConversationService;
