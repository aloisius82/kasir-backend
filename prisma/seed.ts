import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    if (users.length < 1) {
        await prisma.user.create({
            data: {
                username: 'admin',
                password: await bcrypt.hash('password', 10),
                role: 'admin'
            }
        })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect()
    })
