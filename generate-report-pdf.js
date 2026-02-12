const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PORT = 9222;

// Simple static file server for the public directory
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(PUBLIC_DIR, req.url === '/' ? '/test.html' : req.url);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.otf': 'font/otf',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.pdf': 'application/pdf',
      };

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}/test.html`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Get all .page elements and their bounding boxes
  const pages = await page.$$eval('.page', (els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    })
  );

  console.log(`Found ${pages.length} pages`);

  const pageWidth = pages[0].width;
  const pageHeight = pages[0].height;

  await page.setViewport({
    width: Math.ceil(pageWidth),
    height: Math.ceil(pageHeight),
    deviceScaleFactor: 2,
  });

  await page.addStyleTag({
    content: `
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { margin: 0; padding: 0; background: white; }
        .page {
          box-shadow: none !important;
          margin: 0 !important;
          page-break-after: always;
          width: ${pageWidth}px !important;
          height: ${pageHeight}px !important;
          min-height: ${pageHeight}px !important;
          max-height: ${pageHeight}px !important;
        }
        .page:last-child { page-break-after: avoid; }
      }
    `,
  });

  await page.pdf({
    path: path.resolve(__dirname, 'public/report.pdf'),
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log('PDF generated at public/report.pdf');
  await browser.close();
  server.close();
})();
