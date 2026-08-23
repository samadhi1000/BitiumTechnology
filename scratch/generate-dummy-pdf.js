const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createDummyPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  console.log('Generating 120-page dummy PDF catalog...');
  
  for (let i = 1; i <= 120; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size in points (72 points per inch)
    const { width, height } = page.getSize();

    // Determine category and styling based on page number
    let bg = rgb(0.05, 0.08, 0.15); // Dark blue default
    let title = "";
    let desc = "";

    if (i === 1) {
      // Front Cover
      bg = rgb(0.01, 0.03, 0.07); // Very dark navy
      title = "BITIUM TECHNOLOGY";
      desc = "PREMIUM PRINTING & SOLUTIONS CATALOG\n\n[ OPEN CATALOG ]";
    } else if (i === 120) {
      // Back Cover
      bg = rgb(0.01, 0.03, 0.07);
      title = "THE END";
      desc = "Thank you for viewing our catalog.\n\nBitium Technology - Sri Lanka";
    } else if (i === 2) {
      title = "Table of Contents";
      desc = "Pages 3-30: Screen Printing Samples\nPages 31-60: DTF Printing Transfers\nPages 61-90: Laser Cutting & Engraving\nPages 91-119: Artwork Portfolio & References";
    } else if (i >= 3 && i <= 30) {
      bg = rgb(0.07, 0.07, 0.18); // Screen Printing Indigo
      title = `Screen Printing Sample #${i - 2}`;
      desc = "Exposed stencils, tracing printouts, and multi-color garment prints.";
    } else if (i >= 31 && i <= 60) {
      bg = rgb(0.03, 0.12, 0.15); // DTF Cyan
      title = `DTF Transfer Sample #${i - 30}`;
      desc = "Vibrant high-opacity direct-to-film sheet overlays.";
    } else if (i >= 61 && i <= 90) {
      bg = rgb(0.05, 0.15, 0.05); // Laser Green
      title = `Laser Cut & Engrave #${i - 60}`;
      desc = "Precision CO2 custom profiles, acrylic cuts, and wood engravings.";
    } else {
      bg = rgb(0.12, 0.08, 0.05); // Portfolio Amber
      title = `Artwork Portfolio page #${i - 90}`;
      desc = "High-resolution graphic design vector showcase.";
    }

    // Draw background
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: bg,
    });

    // Draw borders (subtle page outline)
    page.drawRectangle({
      x: 10,
      y: 10,
      width: width - 20,
      height: height - 20,
      borderColor: rgb(0.2, 0.2, 0.3),
      borderWidth: 1,
    });

    // Write title (bright green accent color like the theme)
    page.drawText(title, {
      x: 50,
      y: height - 120,
      size: i === 1 ? 32 : 22,
      font: timesBoldFont,
      color: rgb(0.17, 1.0, 0.02), // Lime Accent #2CFF05
    });

    // Write description
    const descLines = desc.split('\n');
    let currentY = height - 180;
    for (const line of descLines) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 13,
        font: timesRomanFont,
        color: rgb(0.9, 0.9, 0.95),
      });
      currentY -= 22;
    }

    // Draw page-specific graphic illustrations
    if (i >= 3 && i <= 30) {
      // Screen printing mesh pattern
      for (let y = 300; y <= 500; y += 40) {
        page.drawLine({
          start: { x: 100, y: y },
          end: { x: width - 100, y: y },
          thickness: 1.5,
          color: rgb(0.3, 0.3, 0.6),
        });
      }
      page.drawText("[ SCREEN PRINT MESH PATTERN ]", {
        x: 150,
        y: 280,
        size: 11,
        font: timesRomanFont,
        color: rgb(0.5, 0.5, 0.7),
      });
    } else if (i >= 31 && i <= 60) {
      // DTF T-shirt outline / circle
      page.drawCircle({
        x: width / 2,
        y: 380,
        radius: 70,
        borderColor: rgb(0.17, 1.0, 0.02),
        borderWidth: 2,
      });
      page.drawText(`DTF GRAPHIC #${i - 30}`, {
        x: width / 2 - 50,
        y: 375,
        size: 12,
        font: timesBoldFont,
        color: rgb(1, 1, 1),
      });
    } else if (i >= 61 && i <= 90) {
      // Laser cutting geometric path
      page.drawRectangle({
        x: width / 2 - 60,
        y: 320,
        width: 120,
        height: 120,
        borderColor: rgb(0.8, 0.2, 0.2),
        borderWidth: 2,
      });
      page.drawText("CUT PROFILE", {
        x: width / 2 - 40,
        y: 375,
        size: 11,
        font: timesBoldFont,
        color: rgb(0.8, 0.2, 0.2),
      });
    } else if (i > 90 && i < 120) {
      // Portfolio design showcase
      page.drawCircle({
        x: width / 2 - 50,
        y: 380,
        radius: 40,
        color: rgb(0.9, 0.5, 0.1),
      });
      page.drawCircle({
        x: width / 2 + 50,
        y: 380,
        radius: 40,
        color: rgb(0.1, 0.6, 0.9),
      });
    }

    // Write footer page number
    page.drawText(`Page ${i} of 120`, {
      x: width / 2 - 35,
      y: 35,
      size: 9,
      font: timesRomanFont,
      color: rgb(0.5, 0.5, 0.6),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const destPath = path.join(__dirname, '../public/dummy-catalog.pdf');
  fs.writeFileSync(destPath, pdfBytes);
  console.log('Dummy PDF created successfully with 120 pages at: ' + destPath);
}

createDummyPdf().catch(console.error);
