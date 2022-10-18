import { prisma } from './prismaClient';

async function seedDB() {
  const testUnit = await prisma.unit.create({
    data: {
      unitName: `Test Unit number #${Math.round(Math.random() * 100)}`,
      Lock: {
        connectOrCreate: {
          where: {
            remoteLockId: process.env.DEVICE_ID as string,
          },
          create: {
            remoteLockId: process.env.DEVICE_ID as string,
          },
        },
      },
    },
    select: {
      id: true,
      unitName: true,
      Lock: {
        select: {
          id: true,
          remoteLockId: true,
        },
      },
    },
  });
  console.dir(
    {
      ...testUnit,
      id: Number(testUnit.id),
      Lock: [
        {
          ...testUnit.Lock[0],
          id: Number(testUnit.Lock[0].id),
        },
      ],
    },
    { depth: null }
  );
}

seedDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
