/**
 * @jest-environment node
 */
import { DELETE } from '@/app/api/user-management/delete-row/route'
import { prismaMock } from '@/prisma-mock';
import { Role } from "@prisma/client";

describe('/api/user-management/delete-row/route', () => {
    test('should return status 200 when delete row is successful', async () => {
        const student = {
            id: "1",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
        }

        prismaMock.user.delete.mockResolvedValue(student)
        const requestObj = {
            json: async () => ({
                email: 'student@test.com'
            }), } as any

        const expected_response = {
            deleted: {
                email: 'student@test.com',
            }
        }

        // Call the POST function
        const response = await DELETE(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(200);
        expect(body).toEqual(expected_response)
    })
})