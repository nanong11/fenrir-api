import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Conversation } from '@interfaces/conversation.interface';
import conversationModel from '@/models/conversation.model';
import { CreateConversationDto, UpdateConversationDto } from '@/dtos/conversation.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
// import { Message } from '@interfaces/message.interface';
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

    const conversationArray: Conversation[] = await this.conversation.find({
      participants: { $elemMatch: { participantId: userId } },
      isActive: true,
    });
    if (!conversationArray) throw new HttpException(409, 'finding conversation failed');

    // FOR GETTING PARTICIPANTS DATA
    if (conversationArray.length > 0) {
      for (let i = 0; i < conversationArray.length; i++) {
        const conversation = conversationArray[i];
        const participantsArray = conversation.participants;

        const participantIdArray = [];
        for (let i = 0; i < participantsArray.length; i++) {
          const element = participantsArray[i];
          participantIdArray.push(element.participantId);
        }
        const participantDataArray: User[] = await this.userService.getAllUserById(participantIdArray);

        const newParticipantsArray = [];
        for (let i = 0; i < participantDataArray.length; i++) {
          const participant = participantDataArray[i];
          const isExist = participantsArray.find(element => element.participantId === participant._id.toString());
          newParticipantsArray.push({
            _id: participant._id,
            email: participant.email,
            username: participant.username,
            name: participant.name,
            role: participant.role,
            isActive: participant.isActive,
            profilePic: participant.profilePic,
            isOnline: participant.isOnline,
            addedBy: isExist.addedBy,
            addedOn: isExist.addedOn,
          });
        }

        // console.log('newParticipantsArray', newParticipantsArray)
        conversation.participants = newParticipantsArray;
      }
    }

    // FOR GETTING MESSAGES
    // for (let i = 0; i < conversationArray.length; i++) {
    //   const conversation: Conversation = conversationArray[i];
    //   const findAllMessageByConversationId: Message[] = await this.message.find({ conversationId: conversation._id, isDeleted: false });
    //   if (!findAllMessageByConversationId) throw new HttpException(409, 'findAllMessageByConversationId failed');
    //   conversation.messages = findAllMessageByConversationId;
    // }

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
      if (conversationData.participants.length < 1) throw new HttpException(400, 'empty participants');
      const findConversationByName: Conversation = await this.conversation.findOne({ name: conversationData.name });
      if (findConversationByName) throw new HttpException(400, 'conversation name already exist');

      const newParticipantsArray: Array<object> = [];
      for (let i = 0; i < conversationData.participants.length; i++) {
        const participantId = conversationData.participants[i];
        newParticipantsArray.push({
          participantId,
          addedBy: participantId,
          addedOn: new Date(),
        });
      }
      conversationData.participants = newParticipantsArray;

      const createConversation: Conversation = await this.conversation.create({ ...conversationData });
      if (!createConversation) throw new HttpException(400, 'creating conversation failed');

      const participantsArray: Array<object> = [];
      for (let i = 0; i < createConversation.participants.length; i++) {
        const participant = createConversation.participants[i];
        const participantData: User = await this.userService.getUserById(participant.participantId);
        participantsArray.push({
          _id: participantData._id,
          email: participantData.email,
          username: participantData.username,
          name: participantData.name,
          role: participantData.role,
          isActive: participantData.isActive,
          profilePic: participantData.profilePic,
          isOnline: participantData.isOnline,
          addedBy: participant.addedBy,
          addedOn: participant.addedOn,
        });
      }
      createConversation.participants = participantsArray;

      return createConversation;
    }
  }

  public async updateConversation(conversationId: string, conversationData: UpdateConversationDto): Promise<Conversation> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');
    if (isEmpty(conversationData)) throw new HttpException(400, 'conversationData is empty');

    const updateConversation: Conversation = await this.conversation.findByIdAndUpdate(conversationId, conversationData, { new: true });
    if (!updateConversation) throw new HttpException(409, 'updateConversation failed');

    return updateConversation;
  }

  public async addParticipant(conversationId: string, conversationData: UpdateConversationDto): Promise<Conversation> {
    if (isEmpty(conversationId)) throw new HttpException(400, 'conversationId is empty');
    if (isEmpty(conversationData)) throw new HttpException(400, 'conversationData is empty');

    const findConversationById: Conversation = await this.conversation.findOne({ _id: conversationId });
    if (isEmpty(findConversationById)) throw new HttpException(400, 'conversationData not exist');

    if (conversationData.participants.length > 0) {
      for (let i = 0; i < conversationData.participants.length; i++) {
        const participantId = conversationData.participants[i];

        const isExist = findConversationById.participants.find(participant => {
          if (participant.participantId === participantId) {
            return participant;
          }
        });

        if (!isExist) {
          const newParticipantsData = {
            participantId,
            addedBy: conversationData.addedBy,
            addedOn: new Date(),
          };

          const updateConversation: Conversation = await this.conversation.findByIdAndUpdate(
            conversationId,
            { $push: { participants: newParticipantsData } },
            { new: true },
          );
          if (!updateConversation) throw new HttpException(409, 'updateConversation failed');
        }
      }

      const updatedConversation: Conversation = await this.conversation.findOne({ _id: conversationId });
      const participantsArray: Array<object> = [];
      for (let i = 0; i < updatedConversation.participants.length; i++) {
        const participant = updatedConversation.participants[i];
        const participantData: User = await this.userService.getUserById(participant.participantId);
        participantsArray.push({
          _id: participantData._id,
          email: participantData.email,
          username: participantData.username,
          name: participantData.name,
          role: participantData.role,
          isActive: participantData.isActive,
          profilePic: participantData.profilePic,
          isOnline: participantData.isOnline,
          addedBy: participant.addedBy,
          addedOn: participant.addedOn,
        });
      }
      updatedConversation.participants = participantsArray;

      return updatedConversation;
    } else {
      throw new HttpException(400, 'no participants to add');
    }
  }

  public async deleteConversation(conversationId: string): Promise<Conversation> {
    const deleteConversation: Conversation = await this.conversation.findByIdAndDelete(conversationId);
    if (!deleteConversation) throw new HttpException(409, 'deleteConversation failed');

    return deleteConversation;
  }
}

export default ConversationService;
