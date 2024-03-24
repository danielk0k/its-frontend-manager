
/**
 * @jest-environment node
 */
import { POST } from '../../../app/api/register/route'
import { prismaMock } from '../../../singleton';
import { Role } from "@prisma/client";

describe('/api/register', () => {
  test('should return new user registered with status 200', async () => {
    const test_user = {
      id: "1",
      email: 'tester1@test.com',
      password: 'password1',
      school_id: 'inst001',
      role: Role.STUDENT,
    }

    const requestObj = {
      json: async () => ({
        email: 'tester1@test.com',
        password: 'password1',
        school_id: 'inst001',
        role: Role.STUDENT,
      }), } as any

      const expected_response = {
        user: {
        email: 'tester1@test.com',
        school_id: 'inst001',
        role: Role.STUDENT,
        }
      }

    prismaMock.user.create.mockResolvedValue(test_user)

    // Call the POST function
    const response = await POST(requestObj);
    const body = await response.json();
    
    // Check the response
    expect(response.status).toBe(200);
    expect(body).toEqual(expected_response)
  })

})


