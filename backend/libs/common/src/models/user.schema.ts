import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractDocument, UserStatus } from '@app/common';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  dependence: string;

  @Prop()
  roles: string[];

  @Prop({ default: UserStatus.EMAIL_ACTIVATION_PENDING })
  status: string;

  @Prop({ default: false })
  isPasswordChanged: boolean;

  @Prop({ default: undefined })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
