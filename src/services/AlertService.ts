import * as mongoose from 'mongoose';
import AlertEvent, { AlertDocument, AlertType } from '../models/AlertEvent';
import { IssueDocument } from '../models/Issue';
import User from '../models/User';
import MailService from './MailService';
import ProjectService from './ProjectService';

const addNewAlertEvent = async (
  user: mongoose.Types.ObjectId | null,
  newIssue: IssueDocument
) => {
  const newIssueType: AlertType = {
    name: 'newIssue',
    title: '새로운 이슈 발생',
  };

  const newAlertDoc = {
    alertType: newIssueType,
    // eslint-disable-next-line no-underscore-dangle
    issue: newIssue._id,
    from: user,
    project: newIssue.projectId,
  };

  const newAlert: AlertDocument = new AlertEvent(newAlertDoc);
  const res = await newAlert.save();

  const memberList: any = await ProjectService.getProjectMemberList(
    newIssue.projectId.toHexString()
  );

  memberList.forEach(member => {
    const mailTemplate = `
  <h2> 새로운 issue 발생  </h2>
  <h3> ${newIssue.name}  - ${newIssue.message}  </h3>
  <h4> 발생 시각 : ${new Date(newIssue.createdAt).toLocaleString()}  </h4>

  <h3> STACK MESSAGE  </h3>
  <div>
   ${newIssue.stack}
  </div>
  
  <a href="http://${process.env.FRONT_HOST}/issues/${
      // eslint-disable-next-line no-underscore-dangle
      newIssue._id
    }" >해당 issue page로 이동하기</a>
  `;
    if (member.email)
      MailService.sendEmail(member.email, 'issue 발생함', mailTemplate);
  });

  return res;
};

const getAlertList = async (user: any) => {
  const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
    user.userId
  );

  const { projects } = await User.findOne({ _id: userId });

  const res: AlertDocument[] = await AlertEvent.find({
    project: { $in: projects },
  })
    .populate({
      path: 'project',
      model: 'Project',
      select: '_id title',
    })
    .exec();

  return res;
};

export default { addNewAlertEvent, getAlertList };
