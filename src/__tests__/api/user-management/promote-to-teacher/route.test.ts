/**
 * @jest-environment node
 */
import { POST } from '@/app/api/user-management/promote-to-teacher/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/api/user-management/promote-to-teacher/route', () => {
    test('should return status 200 when a user is promoted to a teacher role', async () => {
        const student = {
            id: "1",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
        }

        prismaMock.user.update.mockResolvedValue(student)
        const requestObj = {
            json: async () => ({
                email: 'student@test.com'
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);

        // Check the response
        expect(response.status).toBe(200);
    })
})