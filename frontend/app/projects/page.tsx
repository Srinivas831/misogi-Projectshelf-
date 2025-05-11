import { ProjectCard } from "@/components/ProjectCard"

// This would normally come from your Redux store in a client component
const mockProjects = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Redesign the company website with modern UI/UX principles",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Mobile App Development",
    description: "Create a cross-platform mobile application for project management",
    createdAt: "2023-06-20T14:45:00Z",
  },
]

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  )
}
