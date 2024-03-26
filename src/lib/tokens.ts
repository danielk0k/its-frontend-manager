import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export const createPasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 2000);

    const foundToken = await prisma.passwordResetToken.findFirst({
        where : { email }
    })

    if (foundToken) {
        await prisma.passwordResetToken.delete({
            where: {id: foundToken.id}
        })
    }


    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expires
        }
      });

      return passwordResetToken;

}