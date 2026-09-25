import { getStore } from '../services/dbStore.js';

export const getMyCertificates = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { memDb } = getStore();

    const userCerts = memDb.certificates.filter((c) => c.student_id === student_id);

    const enrichedCerts = userCerts.map((cert) => {
      const course = memDb.courses.find((c) => c.id === cert.course_id);
      const student = memDb.profiles.find((p) => p.id === cert.student_id) || req.user;
      return {
        ...cert,
        course_title: course?.title || 'LearnFree Certified Course',
        student_name: student.full_name,
        verification_url: `/verify/${cert.certificate_number}`
      };
    });

    res.json({ success: true, count: enrichedCerts.length, certificates: enrichedCerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    const cert = memDb.certificates.find((c) => c.id === id || c.certificate_number === id);
    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found.' });
    }

    const course = memDb.courses.find((c) => c.id === cert.course_id);
    const student = memDb.profiles.find((p) => p.id === cert.student_id);

    res.json({
      success: true,
      certificate: {
        ...cert,
        course,
        student
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    const { memDb } = getStore();

    const cert = memDb.certificates.find(
      (c) => c.certificate_number.toUpperCase() === certificateNumber.toUpperCase()
    );

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid certificate ID. No matching credential found in LearnFree database.'
      });
    }

    const course = memDb.courses.find((c) => c.id === cert.course_id);
    const student = memDb.profiles.find((p) => p.id === cert.student_id);

    res.json({
      success: true,
      valid: true,
      certificate: {
        certificate_number: cert.certificate_number,
        student_name: student?.full_name || 'LearnFree Student',
        course_title: course?.title || 'Certified Course',
        issued_at: cert.issued_at,
        issuer: 'LearnFree EdTech Platform',
        verification_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${cert.certificate_number}`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
