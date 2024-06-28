import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ViewColumn, ViewEntity, OneToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    avatar: string

    @Column("simple-array", { default: [] })
    photos: string[]

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User
}

@ViewEntity({
    expression: `SELECT "u"."id" as "userId", "u"."firstName" || ' ' || "u"."lastName" as "fullName" from "user" "u" JOIN "client" "c" ON "u"."id" = "c"."userId"`
})
export class UserClientView {
    @ViewColumn()
    userId: number;

    @ViewColumn()
    fullName: string;
}
