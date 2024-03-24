
/**
 * @jest-environment node
 */
import { POST } from '@/app/api/course-management/add-to-course/route'
import { prismaMock } from '@/singleton';
import { Role } from "@prisma/client";

describe('/api/course-management/add-to-course/route', () => {
    test('should return status 500 as student has no permission to add users to course', async () => {
        const student = {
            id: "1",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
        }
      prismaMock.user.findUnique.mockResolvedValue(student)

      const requestObj = {
        json: async () => ({
            requestorEmail: 'student@test.com',
            courseId: 'inst001_CS3213',
            emailsToAdd: ['test2@test.com', 'test3@test.com'],
        }), } as any

      // Call the POST function
      const response = await POST(requestObj);
      const body = await response.json();
        console.log(body)
      // Check the response
      expect(response.status).toBe(500);
      expect(body.message).toEqual('You do not have the permission to make this request.');

    })

    test('should return status 500 as requestor is null', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const requestObj = {
        json: async () => ({
            requestorEmail: 'null@test.com',
            courseId: 'inst001_CS3213',
            emailsToAdd: ['test2@test.com', 'test3@test.com'],
        }), } as any

      // Call the POST function
      const response = await POST(requestObj);
      const body = await response.json();

      // Check the response
      expect(response.status).toBe(500);
      expect(body.message).toEqual('Not a valid user.');

    })

    test('should return status 500 as the course is undefined', async () => {
        const teacher = {
            id: "2",
            email: 'teacher@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.TEACHER,
        }
        prismaMock.user.findUnique.mockResolvedValue(teacher)
        prismaMock.course.findUnique.mockResolvedValue(null)

        const requestObj = {
            json: async () => ({
                requestorEmail: 'teacher@test.com',
                courseId: 'inst001_CS3213',
                emailsToAdd: ['test2@test.com', 'test3@test.com'],
            }), } as any

        // Call the POST function
        const response = await POST(requestObj);
        const body = await response.json();

        // Check the response
        expect(response.status).toBe(500);
        expect(body.message).toEqual('Invalid course ID.');

    })

    test('should return status 200 as a teacher is adding users to a created course ', async () => {
        const teacher = {
            id: "2",
            email: 'teacher@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.TEACHER,
        }

        const course = {
            id: "inst001_CS3213",
            code: "CS3213",
            name: "Foundations of Software Engineering",
            creator_id: 'teacher@test.com',
            school_id: 'inst001',
        }

        const mockUser = {
            id: "3",
            email: 'student@test.com',
            password: 'password1',
            school_id: 'inst001',
            role: Role.STUDENT,
        }

        prismaMock.user.findUnique.mockResolvedValue(teacher)
        prismaMock.course.findUnique.mockResolvedValue(course)
        prismaMock.user.update.mockResolvedValue(mockUser)


        const requestObj = {
            json: async () => ({
                requestorEmail: 'teacher@test.com',
                courseId: 'inst001_CS3213',
                emailsToAdd: ['test2@test.com', 'test3@test.com'],
            }), } as any


        // Call the POST function
        const response = await POST(requestObj);

        // Check the response
        expect(response.status).toBe(200);

    })

  })