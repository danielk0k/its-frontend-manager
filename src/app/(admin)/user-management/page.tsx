'use client';
import * as React from "react"
import { useState, useEffect } from "react";
import { mockInstitutions } from './mockInstitutions';
import { Users, columns } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<Users[]> {
  // Fetch data from your API here.
  return [
    {
      email: "user1@example.com",
      role: "student",
      joinedDate: "2022-01-01",
      action: null,
    },
    {
      email: "user2@example.com",
      role: "student",
      joinedDate: "2022-02-15",
      action: null,
    },
  ]
}

const User_Management_View: React.FC = () => {
  const [institution, setInstitution] = useState(mockInstitutions[0].name); 
  const [data, setData] = useState<Users[]>([]); // Declare and initialize data state
 
  
  useEffect(() => {
    const fetchDataAsync = async () => {
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
            <p>
              Manage Users in {institution} university
            </p>
          </div>
        </div> 
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div> 
      </main>
        
    </div>
  )

}

export default User_Management_View;
