import { Role } from '../schema/company.schema';

export interface IJwtPayload {
  userId: string;
  role: Role;
  email: string;
  companyId: string;
}

export interface isAdminRequest extends Request {
  user?: JwtPayload;
}
