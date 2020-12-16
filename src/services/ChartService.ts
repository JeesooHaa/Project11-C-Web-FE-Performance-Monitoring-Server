import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { ReqUserDocument } from '../models/User';
import ErrorEvent from '../models/ErrorEvent';
import Issue from '../models/Issue';

const checkPermission = (user: ReqUserDocument, projectId: string): boolean => {
  return user.projects.some(project => String(project) === projectId);
};

const objToArr = (obj: object): object[] => {
  const arr = [];
  Object.keys(obj).forEach(item => {
    const temp = {};
    temp['name'] = item;
    temp['value'] = obj[item];
    arr.push(temp);
  });
  return arr;
};

const readDailyError = async (
  user: ReqUserDocument,
  projectId: string,
  day: string
) => {
  if (!checkPermission(user, projectId)) return 'no permission';

  const endDay = moment().endOf('day').toDate();
  const startDay = moment(endDay)
    .subtract(Number(day), 'days')
    .startOf('day')
    .toDate();
  const correctionTime = 9 * 60 * 60000;

  const tempErrorCounts = await ErrorEvent.aggregate([
    {
      $match: {
        projectId: mongoose.Types.ObjectId(projectId),
        date: { $gte: startDay, $lte: endDay },
      },
    },
    { $project: { name: '$name', date: { $add: ['$date', correctionTime] } } },
    {
      $group: {
        _id: {
          name: '$name',
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        year: { $convert: { input: '$_id.year', to: 'string' } },
        month: { $convert: { input: '$_id.month', to: 'string' } },
        day: { $convert: { input: '$_id.day', to: 'string' } },
        count: '$count',
      },
    },
    {
      $project: {
        date: { $concat: ['$year', '/', '$month', '/', '$day'] },
        count: '$count',
      },
    },
    {
      $group: {
        _id: {
          name: '$_id.name',
        },
        dates: {
          $push: {
            date: '$date',
            count: '$count',
          },
        },
      },
    },
    { $sort: { '_id.name': 1 } },
  ]);

  let currentDate = moment(startDay).add(1, 'day').toDate();
  const endDate = moment(endDay).toDate();
  const dates = ['x'];
  const errors = {};
  tempErrorCounts.forEach(data => (errors[data._id.name] = [data._id.name]));

  while (currentDate < endDate) {
    const formatDate = moment(currentDate).format('YYYY/MM/DD');
    dates.push(formatDate);
    tempErrorCounts.forEach(data => {
      const dateData = data.dates.find(date => date.date === formatDate);
      const count = dateData ? dateData.count : 0;
      errors[data._id.name].push(count);
    });
    currentDate = moment(currentDate).add(1, 'days').toDate();
  }

  return { dates, errors: objToArr(errors) };
};

const readIssue = async (user: ReqUserDocument, projectId: string) => {
  if (!checkPermission(user, projectId)) return 'no permission';

  const tempItems = await Issue.aggregate([
    {
      $match: {
        projectId: mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $group: {
        _id: {
          name: '$name',
          resolved: '$resolved',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.name': 1 } },
  ]);

  const allIssue = {};
  const unresolvedIssue = {};
  const resolvedRate = { true: 0, false: 0 };
  const countIdx = 1;

  tempItems.forEach(item => {
    const {
      _id: { name, resolved },
      count,
    } = item;

    if (allIssue[name]) {
      allIssue[name][countIdx] += count;
    } else {
      allIssue[name] = [name, count];
    }
    if (!resolved) {
      if (unresolvedIssue[name]) {
        unresolvedIssue[name][countIdx] += count;
      } else {
        unresolvedIssue[name] = [name, count];
      }
    }
    resolvedRate[resolved] += count;
  });

  return {
    allIssue: objToArr(allIssue),
    unresolvedIssue: objToArr(unresolvedIssue),
    resolvedRate,
  };
};

export default {
  readDailyError,
  readIssue,
};
