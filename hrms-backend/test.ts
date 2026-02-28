import prisma from "./src/config/prisma";
async function main() {
    const id: string = "123";
    const x = await prisma.employee.findUnique({
        where: { employeeId: id }
    });
}
