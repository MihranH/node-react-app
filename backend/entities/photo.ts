import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    url: string

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date

    @ManyToOne(() => User)
    user: User
}
