import {ReturnModelType} from '@typegoose/typegoose';
import Company from '../project.schema';
import {editCompanyInput} from '../../dto/inputs/projects.input';

export default async function editProject(
  CompanyModel: ReturnModelType<typeof Company>,
  input: editCompanyInput
) {
  const company = await CompanyModel.findOne({
    $and: [{associatedClient: input.clientId}],
  });
  if (!company) {
    throw new Error('company not found');
  } else {
    return await CompanyModel.findOneAndUpdate(
      {
        associatedClient: input.clientId,
      },
      {
        brandColors: input.brandColors,
        brandDescription: input.brandDescription,
        brandGuidelinesWithLogo: input.brandGuidelinesWithLogo,
        companyNameProper: input.companyNameProper,
        notBrandColors: input.notBrandColors,
        taglineSlogan: input.taglineSlogan,
        taglineWithLogo: input.taglineWithLogo,
      },
      {new: true}
    );
  }
}
