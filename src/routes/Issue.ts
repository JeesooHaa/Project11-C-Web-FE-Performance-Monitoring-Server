import * as express from 'express';
import IssueController from '../controllers/IssueController';
import CommentController from '../controllers/CommentController';

const router: express.Router = express();
router.get('/', IssueController.listAllIssues);

router.get('/:issueId', IssueController.issueDetail);
router.put('/assignee/:projectId', IssueController.issueAssign);
router.put('/resolved', IssueController.issueResolvedState);

// comment CRUD
router.post('/comment', CommentController.addComment);
router.put('/comment', CommentController.editComment);
router.delete('/:issueId/comment/:commentId', CommentController.deleteComment);

router.get('/project/:projectId', IssueController.listProjectIssues);
router.get(
  '/v2/project/:projectId',
  IssueController.getProjectIssuesWitPagination
);

export default router;
