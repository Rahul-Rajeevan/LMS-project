import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateCertificate = async (student_id: number, course_id: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const certificatePath = path.join(__dirname, `../../certificates/certificate_${student_id}_${course_id}.pdf`);
    
    doc.pipe(fs.createWriteStream(certificatePath));

    doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(30).text(`Student ID: ${student_id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`has successfully completed`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(25).text(`Course ID: ${course_id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(15).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();

    doc.on('finish', () => {
      resolve(`/certificates/certificate_${student_id}_${course_id}.pdf`);
    });

    doc.on('error', (err) => {
      reject(err);
    });
  });
};
