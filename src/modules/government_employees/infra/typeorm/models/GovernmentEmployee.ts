export type EmployeeType = 'militar' | 'civil';

export default interface GovernmentEmployee {
  type: EmployeeType;
  cpf: string;
  name: string;
  registration: string;
}
