"use server"

import prisma from '@/lib/prisma';

export async function getSchools() {
  try {
    const school = await prisma.school.findMany()
    return school
  } catch (error) {
    console.error(error)
  }
}
