/* eslint-disable prettier/prettier */
import { getEmployees } from "@/lib/directus";
import ResetForm from "@/components/ResetForm"
import { IEmployees } from "@/app/types"

export default async function page() {

    const data: any = await getEmployees();
    const employees: IEmployees[] = data.map((employee: IEmployees) => {
        return employee
    })


    return (
        <main>

            <ResetForm data={employees} />

        </main>
    );
}
