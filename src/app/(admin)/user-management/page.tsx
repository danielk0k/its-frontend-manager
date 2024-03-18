'use client';
import * as React from "react"
import { useState, useEffect } from "react";
import { Users, columns } from "./columns"
import { DataTable } from "./data-table"
import { getUserProps } from "@/actions/getUserProps";
import { School } from "@prisma/client";


async function getData(): Promise<Users[]> {
  try {
    const user = await getUserProps();
    const response = await fetch(`/api/get-data/get-students?email=` + user.props.user.email);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data.students;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
}

async function fetchInstitution(): Promise<string> {
  try {
    const user = await getUserProps();
    const response = await fetch('/api/get-data/get-schools', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch institution data');
    }
    const data = await response.json();
    console.log(data);
    const parsed: School[] = data.school_ids.map((school: School) => ({
      id: school.id,
      name: school.name,
    })); 
    for (let index = 0; index < parsed.length; index++) {
      if (parsed[index].id == user.props.user.school_id) {
        return parsed[index].name;
      }
      
    }

    return data.school.school.name;
  } catch (error) {
    console.error('Error fetching institution data:', error);
    return "";
  }
}


const User_Management_View: React.FC = () => {
  const [institution, setInstitution] = useState(""); 
  const [data, setData] = useState<Users[]>([]); // Declare and initialize data state

  useEffect(() => {
    const fetchDataAsync = async () => {
      setInstitution(await fetchInstitution());
      const result = await getData();
      setData(result);
    };
    fetchDataAsync();
  }, []);


  return (
    <div>
      <main className="flex min-h-screen flex-col">
        <div className="z-10 max-w-5xl w-full justify-start font-mono text-sm lg:flex">
          <div className="absolute left-5 top-18">
            
          </div>
        </div> 
        <div className="container mx-auto py-10">
          <DataTable institution={institution} columns={columns} data={data}/>
        </div> 
      </main>
        
    </div>
  )

}

export default User_Management_View;
