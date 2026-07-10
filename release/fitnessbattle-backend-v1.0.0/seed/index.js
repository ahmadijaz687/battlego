import 'dotenv/config';
import { prisma } from '../services/database.js';
import * as bcrypt from 'bcrypt';
async function seed() {
    try {
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const demoUsers = [
            { email: 'demo@fitbattle.com', name: 'Demo User' },
            { email: 'alex@fitbattle.com', name: 'Alex Johnson' },
            { email: 'mike@fitbattle.com', name: 'Mike Smith' },
        ];
        for (const demoUser of demoUsers) {
            const existingUser = await prisma.user.findUnique({
                where: { email: demoUser.email },
            });
            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        email: demoUser.email,
                        password: hashedPassword,
                        name: demoUser.name,
                    },
                });
                console.log(`Created: ${demoUser.email} / Password123!`);
            }
        }
        console.log('Demo users ready: demo@fitbattle.com, alex@fitbattle.com, mike@fitbattle.com');
        await prisma.$disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Seeding failed:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
seed();
