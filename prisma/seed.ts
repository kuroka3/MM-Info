import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const magicalMirai = await prisma.series.upsert({
    where: { slug: 'magical-mirai' },
    create: { name: '매지컬 미라이', slug: 'magical-mirai' },
    update: {},
  })

  const mikuExpo = await prisma.series.upsert({
    where: { slug: 'miku-expo' },
    create: { name: 'MIKU EXPO', slug: 'miku-expo' },
    update: {},
  })

  const magicalMirai2025 = await prisma.event.upsert({
    where: { slug: 'magical-mirai-2025' },
    create: {
      name: '매지컬 미라이 2025',
      year: 2025,
      slug: 'magical-mirai-2025',
      series: { connect: { id: magicalMirai.id } },
    },
    update: {},
  })

  await prisma.event.upsert({
    where: { slug: 'miku-expo-2025-asia' },
    create: {
      name: 'MIKU EXPO 2025 ASIA',
      year: 2025,
      slug: 'miku-expo-2025-asia',
      series: { connect: { id: mikuExpo.id } },
    },
    update: {},
  })

  await prisma.concert.updateMany({
    data: { eventId: magicalMirai2025.id },
    where: { eventId: { equals: null } },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
