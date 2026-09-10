const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

const auditData = JSON.parse(fs.readFileSync('anabya_live_audit.json', 'utf8'));

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('image/')) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length < 500) {
        throw new Error(`Buffer too small: ${buffer.length} bytes`);
      }
      return { buffer, contentType };
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function run() {
  console.log(`Starting download of authentic Anabya images for ${auditData.length} products...`);
  const publicDir = path.join(process.cwd(), 'public', 'products', 'anabya');
  fs.mkdirSync(publicDir, { recursive: true });

  let totalImages = 0;
  let downloadedCount = 0;
  let verifiedCount = 0;
  let failedCount = 0;
  const productReports = [];

  for (let pIdx = 0; pIdx < auditData.length; pIdx++) {
    const p = auditData[pIdx];
    const pDir = path.join(publicDir, p.handle);
    fs.mkdirSync(pDir, { recursive: true });

    const prodReport = {
      productTitle: p.title,
      handle: p.handle,
      totalSourceImages: p.images.length,
      downloaded: [],
      broken: [],
      missing: []
    };

    console.log(`[${pIdx + 1}/${auditData.length}] Processing ${p.title} (${p.images.length} images)...`);

    for (let imgIdx = 0; imgIdx < p.images.length; imgIdx++) {
      totalImages++;
      const img = p.images[imgIdx];
      const position = imgIdx + 1;

      // Extract file extension from src URL or default to jpg
      let ext = 'jpg';
      const cleanUrl = img.src.split('?')[0];
      const matchExt = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
      if (matchExt) {
        ext = matchExt[1].toLowerCase();
      }

      const filename = `${String(position).padStart(2, '0')}_${img.id}.${ext}`;
      const filePath = path.join(pDir, filename);
      const relativePath = `/products/anabya/${p.handle}/${filename}`;

      try {
        const { buffer, contentType } = await fetchWithRetry(img.src);
        
        // Validate image decodability
        const dims = imageSize(buffer);
        if (!dims || !dims.width || !dims.height) {
          throw new Error('Image could not be decoded (missing dimensions)');
        }

        // Write to disk
        fs.writeFileSync(filePath, buffer);
        downloadedCount++;
        verifiedCount++;

        prodReport.downloaded.push({
          position,
          id: img.id,
          filename,
          relativePath,
          width: dims.width,
          height: dims.height,
          type: dims.type,
          bytes: buffer.length
        });
      } catch (err) {
        console.error(`  FAILED: Image ${img.id} for ${p.title}:`, err.message);
        failedCount++;
        prodReport.broken.push({
          position,
          id: img.id,
          src: img.src,
          error: err.message
        });
      }
    }

    productReports.push(prodReport);
  }

  const summary = {
    totalProducts: auditData.length,
    totalImages,
    downloadedCount,
    verifiedCount,
    failedCount,
    products: productReports
  };

  fs.writeFileSync('image_download_report.json', JSON.stringify(summary, null, 2));

  console.log('\n========================================');
  console.log('DOWNLOAD COMPLETE:');
  console.log(`Total Products: ${auditData.length}`);
  console.log(`Total Images: ${totalImages}`);
  console.log(`Verified On Disk: ${verifiedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log('========================================\n');
}

run().catch(err => {
  console.error('Fatal error during download:', err);
  process.exit(1);
});
