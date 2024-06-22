import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ViewColumn, ViewEntity, OneToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    avatar: string

    @Column("simple-array")
    photos: string[]

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}

@ViewEntity({
    expression: `SELECT "u"."id", "u"."firstName", "u"."lastName", "u"."firstName" || ' ' || "u"."lastName" as "fullName" from "user" "u" JOIN "client" "c" ON "u"."id" = "c"."userId"`
})
export class UserClientView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    firstName: string;

    @ViewColumn()
    lastName: string;

    @ViewColumn()
    fullName: string;
}
