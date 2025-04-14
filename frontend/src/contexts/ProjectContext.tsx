import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { Project, StatusType } from "../types/projects";

type ProjectAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | {
      type: "UPDATE_PROJECT";
      payload: { id: string; updates: Partial<Project> };
    }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const ProjectContext = createContext<
  | {
      state: ProjectState;
      dispatch: React.Dispatch<ProjectAction>;
      getProject: (id: string) => Project | undefined;
      updateProjectStatus: (id: string, status: StatusType) => void;
    }
  | undefined
>(undefined);

function projectReducer(
  state: ProjectState,
  action: ProjectAction
): ProjectState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, loading: false };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.updates }
            : project
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const ProjectProvider: React.FC<{
  children: ReactNode;
  initialProjects?: Project[];
}> = ({ children, initialProjects = [] }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    ...initialState,
    projects: initialProjects,
  });

  const getProject = useCallback(
    (id: string) => state.projects.find((project) => project.id === id),
    [state.projects]
  );

  const updateProjectStatus = useCallback(
    (id: string, status: StatusType) => {
      dispatch({
        type: "UPDATE_PROJECT",
        payload: { id, updates: { status } },
      });
    },
    [dispatch]
  );

  return (
    <ProjectContext.Provider
      value={{ state, dispatch, getProject, updateProjectStatus }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
