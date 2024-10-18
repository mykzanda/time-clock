import { getEmployees } from "@/lib/directus";
import TimeForm from "@/components/TimeForm";
import { IEmployees } from "@/app/types";

export default async function Home() {
  const data: any = await getEmployees();
  const employees: IEmployees[] = data.map((employee: IEmployees) => {
    return employee;
  });

  return (
    <main>
      <TimeForm data={employees} />
    </main>
  );
}
