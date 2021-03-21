import {
  ObjectID,
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import GovernmentEmployee, {
  EmployeeType,
} from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';

@Entity('government_employee_search_logs')
export default class GovernmentEmployeeSearchLog {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  government_employees: GovernmentEmployee[];

  @Column()
  employee_types: EmployeeType[];

  @Column()
  superior_army_organ: string;

  @Column()
  army_organ: string;

  @Column()
  page: number;

  @Column()
  total_pages: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
