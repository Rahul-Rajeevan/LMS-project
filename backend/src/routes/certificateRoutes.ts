import express from 'express';
const { issueCertificate, getCertificate } =require('../controllers/certificateController');

const router = express.Router();

router.post('/issue', issueCertificate); // Issue a certificate
router.get('/:student_id/:course_id', getCertificate); // Get certificate

export default router;
