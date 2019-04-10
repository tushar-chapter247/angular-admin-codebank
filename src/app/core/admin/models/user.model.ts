export interface IUser {
  createdAt: Date;
  email: string;
  id: string;
  isDeleted: string;
  lastAccessed: DataCue;
  name: string;
  role: string;
  settings: any;
  signupVia: string;
  status: string;
  totalReach: number;
  type: string;
  updatedAt: Date;
}
