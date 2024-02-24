'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
//import TopPanel from './TopPanel'; 
import { mockUsers } from './mockData';
import { mockInstitutions } from './mockInstitutions';
import NavigationBar from "@/components/navigation-bar";


interface User {
  email: string;
  role: string;
  joinedDate: string;
  action: string;
}

const user_management_view: React.FC = () => {
  //const [institution, setInstitution] = useState("Your Institution");
  const [institution, setInstitution] = useState(mockInstitutions[0].name); 
  //const [users, setUsers] = useState<User[]>([]);   //dont delete this line
  const [users, setUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEllipsisIndex, setSelectedEllipsisIndex] = useState<number | null>(null);
  //const [dropdownZIndex, setDropdownZIndex] = useState<number>(-1);

  //for checkbox
  const toggleUserSelection = (user: User) => {
    const isSelected = selectedUsers.some(selectedUser => selectedUser.email === user.email);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.email !== user.email));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  //for the Ellipsis button in each row 
  const handleEllipsisClick = (index: number) => {
    setSelectedEllipsisIndex(selectedEllipsisIndex === index ? null : index);
    //setDropdownZIndex(selectedEllipsisIndex === index ? -1 : 999);
  };

  const handleDeleteUser = async (email: string) => {
    try {
      await fetch(`your_backend_api_url_here/${email}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.email !== email));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handlePromoteUser = (email: string) => {
    const updatedUsers = users.map(user => {
      if (user.email === email && user.role === "student") {
        return { ...user, role: "tutor" };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  //for search bar
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch user data from backend API
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from backend API
  const fetchUserData = async () => {
    try {
      const response = await fetch("your_backend_api_url_here");
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData); // Set fetched user data to state
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  return (
    <div>
      
      <main className="flex min-h-screen flex-col">
        <div className="z-10 max-w-5xl w-full justify-start font-mono text-sm lg:flex">
          <div className="absolute left-5 top-18">
            <p>
              Manage Users in {institution} university
            </p>
          </div>
          <div className="">
            <div className="absolute right-0 top-18">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        {/* Rectangle Box containing users data */}
        <div className="w-full bg-gray-100 p-4 rounded-md mt-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-6 gap-2">
              <div>Select</div>
              <div>Index</div>
              <div>Email</div>
              <div>Role</div>
              <div>Joined Date</div>
              <div>Action</div>
            </div>
            {filteredUsers.map((user, index) => (
              <div key={index} className="grid grid-cols-6 gap-2">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.some(selectedUser => selectedUser.email === user.email)}
                    onChange={() => toggleUserSelection(user)}
                  />
                </div>
                <div>{index + 1}</div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div>{user.joinedDate}</div>
                
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div onClick={() => handleEllipsisClick(index)} style={{ cursor: 'pointer' }}>
                      {selectedEllipsisIndex === index ? '▲' : '...'}
                  </div>
                  {selectedEllipsisIndex === index && (
                    <div style={{ position: 'absolute', top: '20px', left: '0', background: 'white', border: '1px solid black', padding: '5px', zIndex: 999 }}>
                      <div style={{ border: '1px solid black', padding: '5px', backgroundColor: 'white' }}>
                        <button onClick={() => handlePromoteUser(user.email)} style={{ display: 'block', marginBottom: '5px' }}>Promote</button>
                      </div>
                      <div style={{ border: '1px solid black', padding: '5px', backgroundColor: 'white' }}>
                        <button onClick={() => handleDeleteUser(user.email)}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
            ))}
          </div>
        </div>
      </main>
    </div>
      
      
  );
}

export default user_management_view;
