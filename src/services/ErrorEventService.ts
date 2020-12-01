import * as crpyto from 'crypto';
import ErrorEvent, { ErrorEventDocument } from '../models/ErrorEvent';

class ErrorEventService {
  saveErrorEvent = async (LogData: {}) => {
    const eventId: string = crpyto
      .createHash('md5')
      // eslint-disable-next-line dot-notation
      .update(LogData['content'])
      .digest('hex');
    const newErrorEvent = new ErrorEvent({ ...LogData, eventId });
    await newErrorEvent.save();
    return newErrorEvent;
  };

  getErrorEvent = async (eventId: String) => {
    const res: ErrorEventDocument = await ErrorEvent.findOne({
      eventId,
    }).exec();
    return res;
  };

  getAllErrorEvent = async () => {
    const res: ErrorEventDocument[] = await ErrorEvent.find().exec();
    return res;
  };
}

const errorEventService = new ErrorEventService();
export default errorEventService;
