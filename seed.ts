import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/lib/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const initialChannels = [
    {
        id: "asia-tv",
        name: "ASIA TV",
        url: "https://stream.asiatvnet.com/1/live/master.m3u8",
        category: "Entertainment",
        logo: "📡",
        viewers: "12.4k",
        trending: true
    },
    {
        id: "hiru-tv",
        name: "HIRU TV",
        url: "https://tv.hiruhost.com:1936/8012/8012/playlist.m3u8",
        category: "Entertainment",
        logo: "🏮",
        viewers: "450k",
        trending: true
    },
    {
        id: "siyatha-tv",
        name: "SIYATHA TV",
        url: "https://rtmp01.voaplus.com/hls/6x6ik312qk4grfxocfcv.m3u8",
        category: "Entertainment",
        logo: "📺",
        viewers: "210k",
        trending: false
    },
    {
        id: "swarnawahini",
        name: "SWARNAWAHINI",
        url: "https://jk3lz8xklw79-hls-live.5centscdn.com/live/6226f7cbe59e99a90b5cef6f94f966fd.sdp/playlist.m3u8",
        category: "Entertainment",
        logo: "🎭",
        viewers: "840k",
        trending: true
    },
    {
        id: "tv-1",
        name: "TV 1",
        url: "https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8",
        category: "Entertainment",
        logo: "🌟",
        viewers: "150k",
        trending: false
    },
    {
        id: "apple-event",
        name: "Apple Event Stream",
        url: "https://apple-event.apple.com/main.m3u8",
        category: "Tech",
        logo: "🍎",
        viewers: "1.2M",
        trending: true
    },
    {
        id: "mux-test",
        name: "Mux Global Stream",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        category: "Sports",
        logo: "⚽",
        viewers: "45.2k",
        trending: true
    },
    {
        id: "star-sports-1",
        name: "STAR SPORTS 01",
        url: "https://playerado.top/embed2.php?id=starsp",
        category: "Sports",
        logo: "🏏",
        viewers: "1.5M",
        trending: true
    },
    {
        id: "star-sports-2",
        name: "STAR SPORTS 02",
        url: "https://playerado.top/embed2.php?id=starsp2",
        category: "Sports",
        logo: "🎾",
        viewers: "850k",
        trending: false
    },
    {
        id: "star-sports-3",
        name: "STAR SPORTS 03",
        url: "https://playerado.top/embed2.php?id=starsp3",
        category: "Sports",
        logo: "🏑",
        viewers: "420k",
        trending: false
    },
    {
        id: "sky-sports",
        name: "SKY SPORTS",
        url: "https://playerado.top/embed2.php?id=crich2",
        category: "Sports",
        logo: "🏎️",
        viewers: "2.1M",
        trending: true
    },
    {
        id: "willow-sports",
        name: "WILLOW SPORTS",
        url: "https://playerado.top/embed2.php?id=willow",
        category: "Sports",
        logo: "🏏",
        viewers: "640k",
        trending: true
    },
    {
        id: "willow-extra",
        name: "WILLOW EXTRA",
        url: "https://playerado.top/embed2.php?id=willowextra",
        category: "Sports",
        logo: "🏏",
        viewers: "320k",
        trending: false
    },
    {
        id: "a-sports",
        name: "A SPORTS",
        url: "https://playerado.top/embed2.php?id=asports",
        category: "Sports",
        logo: "🏆",
        viewers: "910k",
        trending: true
    },
    {
        id: "akamai-hls",
        name: "HLS News Live",
        url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        category: "News",
        logo: "🌐",
        viewers: "8.9k",
        trending: false
    },
    {
        id: "akamai-dash",
        name: "DASH Cinema HD",
        url: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
        category: "Movies",
        logo: "🎬",
        viewers: "15.4k",
        trending: false
    },
    {
        id: "bitmovin-test",
        name: "Art & Culture TV",
        url: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
        category: "Culture",
        logo: "🎨",
        viewers: "4.2k",
        trending: false
    },
    {
        id: "nickelodeon",
        name: "NICKELODEON",
        url: "https://playerado.top/embed2.php?id=nick",
        category: "Entertainment",
        logo: "🧡",
        viewers: "125k",
        trending: true
    }
];

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });

    console.log('Seeding channels...');

    for (const channel of initialChannels) {
        await db.insert(schema.channels).values(channel).onConflictDoUpdate({
            target: schema.channels.id,
            set: {
                name: channel.name,
                url: channel.url,
                category: channel.category,
                logo: channel.logo,
                viewers: channel.viewers,
                trending: channel.trending,
            }
        });
    }

    console.log('Seeding complete!');
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
