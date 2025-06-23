export interface Classification {
  id: string;
  name: string;
  fullName?: string;
  isInactive?: boolean;
  parent?: string;
  // Add other fields as needed
}