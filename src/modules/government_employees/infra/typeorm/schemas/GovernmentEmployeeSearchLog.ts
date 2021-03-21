import {
  ObjectID,
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import GovernmentEmployee from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';

@Entity('government_employee_search_logs')
export default class GovernmentEmployeeSearchLog {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  government_employees: GovernmentEmployee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
