import {ReturnModelType} from '@typegoose/typegoose';
import {GraphQLError} from 'graphql';
import Contract from '../project.schema';
import {deleteContractInput} from '../../dto/inputs/projects.input';

export default async function deleteContract(
  ContractModel: ReturnModelType<typeof Contract>,
  input: deleteContractInput // addBuyerInput & {associatedAgent: string}
) {
  try {
    const deletedContract = await ContractModel.findOneAndUpdate({
      associatedBuyer: input.buyerId,
      associatedAgent: input.agentId,
    });
    return deletedContract;
  } catch (error) {
    throw new GraphQLError(error);
  }
}
