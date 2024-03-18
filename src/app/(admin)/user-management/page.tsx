import { getSchools } from "@/actions/getSchools";
import { getUserProps } from "@/actions/getUserProps";
import { getUsers } from "@/actions/getUsers";
import DataTableContainer from "@/components/user-management/DataTableContainer";

export default async function UserManagementView() {
  const user = await getUserProps();
  const schools = await getSchools();
  const users = await getUsers(user.props.user);
  const { name } = schools.filter(
    ({ id }) => id == user.props.user.school_id
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
