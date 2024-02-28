// mockInstitutions.ts

export interface Institution {
  id: number;
  name: string;
}

export const mockInstitutions: Institution[] = [
  { id: 1, name: "University of Example" },
  { id: 2, name: "Example State University" },
  { id: 3, name: "Example Institute of Technology" },
  { id: 4, name: "Example Community College" },
];
