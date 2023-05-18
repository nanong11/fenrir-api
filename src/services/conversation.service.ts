import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Conversation } from '@interfaces/conversation.interface';
import conversationModel from '@/models/conversation.model';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversation.dto';
// import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { Message } from '@interfaces/message.interface';
import messageModel from '@/models/message.model';

class ConversationService {
  public conversation = conversationModel;
  public message = messageModel;
  public userService = new userService();

  public async findAllConversation(): Promise<Conversation[]> {
    const allConversation: Conversation[] = await this.conversation.find();
    return allConversation;
  }

  public async findConversationById(conversationId: string): Promise<Conversation> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');

    const findConversationById: Conversation = await this.conversation.findOne({ _id: conversationId });
    if (!findConversationById) throw new HttpException(409, "conversation doesn't exist");

    return findConversationById;
  }

  public async findConversationByUserId(userId: string): Promise<Conversation[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'userId is empty');

    const conversationArray: Conversation[] = await this.conversation.find({ participants: { $elemMatch: { userId } }, isActive: true });
    if (!conversationArray) throw new HttpException(409, 'conversation empty');

    for (let i = 0; i < conversationArray.length; i++) {
      const conversation: Conversation = conversationArray[i];
      const findAllMessageByConversationId: Message[] = await this.message.find({ conversationId: conversation._id, isDeleted: false });
      if (!findAllMessageByConversationId) throw new HttpException(409, 'findAllMessageByConversationId failed');
      conversation.messages = findAllMessageByConversationId;
    }

    return conversationArray;
  }

  public async createConversation(conversationData: CreateConversationDto): Promise<Conversation> {
    if (isEmpty(conversationData)) throw new HttpException(400, 'conversationData is empty');
    // if (conversationData.participants.length < 2) throw new HttpException(400, 'need 2 or more participants');

    // FOR CREATING CONVERSATION TYPE PM
    // MODIFY FOR CONVERSATION TYPE GROUP IN THE FUTURE
    if (conversationData.type === 'pm') {
      // const participantUserId_1: string = conversationData.participants[0];
      // const participantUserId_2: string = conversationData.participants[1];
      // const conversationArray: Conversation[] = await this.conversation.find({
      //   participants: { $elemMatch: { userId: participantUserId_1 } },
      //   isActive: true,
      // });
      // const conversationAlreadyExist: Conversation = conversationArray.find(conversation =>
      //   conversation.participants.find(participant => participant.userId === participantUserId_2),
      // );
      // if (conversationAlreadyExist) return conversationAlreadyExist;
      // const participantsArray: Array<object> = [];
      // for (let i = 0; i < conversationData.participants.length; i++) {
      //   const participantId = conversationData.participants[i];
      //   const otherParticipantData: User = await this.userService.getUserById(participantId);
      //   participantsArray.push({
      //     userId: participantId,
      //     firstName: otherParticipantData.firstName,
      //     lastName: otherParticipantData.lastName,
      //     profilePic: otherParticipantData.profilePic,
      //   });
      // }
      // conversationData.participants = participantsArray;
      // const createConversation = await this.conversation.create({ ...conversationData });
      // return createConversation;
    } else {
      const createConversation: Conversation = await this.conversation.create({ ...conversationData });
      return createConversation;
    }
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
