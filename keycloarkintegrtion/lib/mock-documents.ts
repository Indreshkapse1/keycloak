import { Resource } from "@/types/permissions";

export const mockDocuments: Resource[] = [
  {
    id: "document-1",
    name: "Q1 Financial Report",
    type: "document",
    owner: "admin",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "document-2",
    name: "Marketing Strategy 2024",
    type: "document",
    owner: "manager",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "document-3",
    name: "Employee Handbook",
    type: "document",
    owner: "hr",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "document-4",
    name: "Technical Specifications",
    type: "document",
    owner: "tech-lead",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
  },
];

export function getDocumentById(id: string): Resource | undefined {
  return mockDocuments.find((doc) => doc.id === id);
}

export function getAllDocuments(): Resource[] {
  return mockDocuments;
}
