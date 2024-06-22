import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';
import { NAME_MIN, NAME_MAX } from '../constants.json';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: NAME_MAX })
    @Length(NAME_MIN, NAME_MAX)
    firstName: string

    @Column({ length: NAME_MAX })
    @Length(NAME_MIN, NAME_MAX)
    lastName: string

    @Column({ unique: true })
    email: string

    @Column({ select: false })
    password: string

    @Column()
    role: string

    @Column({ default: true })
    active: boolean

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date
}
