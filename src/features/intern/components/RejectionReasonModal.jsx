import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../shared/styles/Modal.module.css';

const RejectionReasonModal = ({ isOpen, onClose, rejectionReason, itemType = 'perizinan' }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5,
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    onClick={onClose}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ maxWidth: '450px' }}
                    >
                        {/* Icon */}
                        <motion.div className={styles.modalIcon} variants={itemVariants}>
                            <motion.img
                                src="/images/remove.png"
                                alt="rejected"
                                className={styles.iconImage}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 200,
                                    delay: 0.3
                                }}
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className={styles.modalTitle}
                            variants={itemVariants}
                            style={{ 
                                fontSize: '20px', 
                                fontWeight: '700', 
                                marginTop: '20px',
                                color: '#1F2937'
                            }}
                        >
                            Pengajuan Ditolak
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            className={styles.modalMessage}
                            variants={itemVariants}
                            style={{ 
                                marginTop: '8px', 
                                color: '#6B7280',
                                fontSize: '14px'
                            }}
                        >
                            Alasan penolakan dari mentor
                        </motion.p>

                        {/* Rejection Reason Box */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                marginTop: '24px',
                                width: '100%',
                                background: '#FEF2F2',
                                border: '1px solid #FEE2E2',
                                borderRadius: '12px',
                                padding: '16px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{
                                fontSize: '14px',
                                color: '#7F1D1D',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {rejectionReason}
                            </div>
                        </motion.div>

                        {/* Info Box */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                background: '#F0F9FF',
                                border: '1px solid #BAE6FD',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <i className="ri-information-line" style={{ 
                                fontSize: '18px', 
                                color: '#0284C7',
                                flexShrink: 0,
                                marginTop: '1px'
                            }}></i>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#075985',
                                    lineHeight: '1.5'
                                }}>
                                    Silakan perbaiki dan buat pengajuan {itemType} baru
                                </div>
                            </div>
                        </motion.div>

                        {/* Button */}
                        <motion.button
                            variants={itemVariants}
                            onClick={onClose}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                marginTop: '24px',
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Mengerti
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RejectionReasonModal;
