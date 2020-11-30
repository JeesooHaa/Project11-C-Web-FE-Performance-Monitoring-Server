import Project from '../models/Project';

// 유저 정보는 JWT에서 가져올것
// 유저 정보에도 프로젝트 정보를 추가할 것
const createProject = async (data: any) => {
  const { title, description, framework, dsn } = data;

  const docs = Object({
    title,
    description,
    framework,
    dsn,
  });

  const result = await Project.create(docs);
  return result;
};

// members에 요청을 보낸 유저가 존재할 경우 결과를 반환할 것
const readProject = async (projectId: string) => {
  const project = await Project.findById(projectId);
  return project;
};

// 유저 정보에 있는 project 정보도 삭제할것
const removeProject = async (projectId: string) => {
  const deletedProject = await Project.findByIdAndDelete(projectId);
  return deletedProject;
};

export default { createProject, readProject, removeProject };