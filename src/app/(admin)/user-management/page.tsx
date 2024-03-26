import { getSchools } from "@/actions/getSchools";
import { getUserProps } from "@/actions/getUserProps";
import { getUsers } from "@/actions/getUsers";
import DataTableContainer from "@/components/user-management/DataTableContainer";
import { redirect } from "next/navigation";

export default async function UserManagementView() {
  const userProps = await getUserProps();
  const user = userProps.props.user;
  if (!user) {
    redirect("/");
  }
  const users = await getUsers(user).then(users => users ? users : []);
  const schools = await getSchools().then(schools => schools ? schools : []);
  const { name } = schools.filter(
    ({ id }) => id == user.school_id
  )[0];
  return (
    <div>
      <main className="flex min-h-screen flex-col">
        <div className="z-10 max-w-5xl w-full justify-start font-mono text-sm lg:flex">
          <div className="absolute left-5 top-18"></div>
        </div>
        <DataTableContainer name={name} users={users}></DataTableContainer>
      </main>
    </div>
  );
}
