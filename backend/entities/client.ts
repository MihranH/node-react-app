import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ViewColumn, ViewEntity, OneToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Photo } from './photo';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    avatar: string

    @OneToMany(() => Photo, (photo) => photo.client, { cascade: true })
    @JoinColumn()
    photos: Photo[]

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
