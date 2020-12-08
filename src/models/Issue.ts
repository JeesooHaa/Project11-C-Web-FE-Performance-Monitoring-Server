import * as mongoose from 'mongoose';
import { ErrorEventSchema, ErrorEventDocument } from './ErrorEvent';
import { CommentSchema, CommentDocument } from './Comment';

const IssueSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
    },
    stack: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    groupHash: {
      type: String,
    },
    errorEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ErrorEvent',
      },
    ],
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

export interface IssueDocument extends mongoose.Document {
  name: String;
  message: String;
  stack: String;
  groupHash: String;
  comments: CommentDocument[];
  errorEvents: mongoose.Types.ObjectId[];
  projectId: mongoose.Types.ObjectId;
}

const Issue: mongoose.Model<IssueDocument> = mongoose.model(
  'Issue',
  IssueSchema
);

export default Issue;
