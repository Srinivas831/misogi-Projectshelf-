import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Project {
  id: string
  title: string
  description: string
  createdAt: string
}

interface ProjectsState {
  projects: Project[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ProjectsState = {
  projects: [],
  status: "idle",
  error: null,
}

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload)
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload)
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex((project) => project.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
  },
})

export const { addProject, removeProject, updateProject } = projectsSlice.actions
export default projectsSlice.reducer
