import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = path.join(process.cwd(), '.dev', 'db_backup', 'auto');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`📦 Creating database backup: ${timestamp}\n`);

  const songs = await prisma.song.findMany({
    include: {
      setlists: {
        include: {
          setlist: true,
        },
      },
      eventVariations: {
        include: {
          event: true,
        },
      },
    },
  });

  const setlists = await prisma.setlist.findMany({
    include: {
      songs: {
        include: {
          song: true,
        },
      },
      concerts: true,
    },
  });

  const concerts = await prisma.concert.findMany({
    include: {
      venue: true,
      setlist: true,
      event: {
        include: {
          series: true,
        },
      },
    },
  });

  const events = await prisma.event.findMany({
    include: {
      series: true,
      concerts: true,
    },
  });

  const series = await prisma.series.findMany({
    include: {
      events: true,
    },
  });

  const venues = await prisma.venue.findMany();

  const backup = {
    timestamp,
    songs,
    setlists,
    concerts,
    events,
    series,
    venues,
  };

  const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  const summaryPath = path.join(backupDir, `backup-${timestamp}-summary.txt`);
  const summary = `Database Backup Summary
Timestamp: ${timestamp}

Songs: ${songs.length}
Setlists: ${setlists.length}
Concerts: ${concerts.length}
Events: ${events.length}
Series: ${series.length}
Venues: ${venues.length}

Total backup size: ${(fs.statSync(backupPath).size / 1024 / 1024).toFixed(2)} MB
`;

  fs.writeFileSync(summaryPath, summary);

  console.log(`✅ Backup created successfully!`);
  console.log(`   Location: ${backupPath}`);
  console.log(`   Summary: ${summaryPath}\n`);
  console.log(summary);

  const backupFiles = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (backupFiles.length > 10) {
    console.log(`\n🧹 Cleaning up old backups (keeping latest 10)...`);
    const toDelete = backupFiles.slice(10);
    toDelete.forEach(file => {
      const filePath = path.join(backupDir, file);
      const summaryFile = file.replace('.json', '-summary.txt');
      const summaryPath = path.join(backupDir, summaryFile);

      fs.unlinkSync(filePath);
      if (fs.existsSync(summaryPath)) {
        fs.unlinkSync(summaryPath);
      }
      console.log(`   Deleted: ${file}`);
    });
  }
}

backupDatabase()
  .catch((e) => {
    console.error('Backup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
