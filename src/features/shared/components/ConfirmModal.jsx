import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Modal.module.css';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    subtitle,
    confirmText = 'Ya, hapus',
    cancelText = 'Batal',
    image,
    confirmButtonStyle = 'danger' // 'danger' or 'primary'
}) => {
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

    const handleConfirm = () => {
        onConfirm();
        onClose();
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
                        style={{ maxWidth: '420px' }}
                    >
                        <motion.div className={styles.modalIcon} variants={itemVariants}>
                            <motion.img
                                src={image}
                                alt="confirm icon"
                                className={styles.iconImage}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 200,
                                    delay: 0.3
                                }}
                                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                            />
                        </motion.div>

                        <motion.h2
                            className={styles.modalTitle}
                            variants={itemVariants}
                            style={{ fontSize: '18px', fontWeight: '600', marginTop: '20px' }}
                        >
                            {title}
                        </motion.h2>

                        {message && (
                            <motion.p
                                className={styles.modalMessage}
                                variants={itemVariants}
                                style={{ marginTop: '8px', color: '#666' }}
                            >
                                {message}
                            </motion.p>
                        )}

                        {subtitle && (
                            <motion.p
                                variants={itemVariants}
                                style={{
                                    marginTop: '8px',
                                    fontSize: '13px',
                                    color: '#888',
                                    lineHeight: '1.5'
                                }}
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.div
                            variants={itemVariants}
                            style={{
                                display: 'flex',
                                gap: '12px',
                                marginTop: '28px',
                                width: '100%'
                            }}
                        >
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1,
                                    padding: '12px 24px',
                                    border: '1.5px solid #E5E7EB',
                                    background: 'white',
                                    color: '#374151',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cancelText}
                            </motion.button>
                            <motion.button
                                onClick={handleConfirm}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: 1,
                                    padding: '12px 24px',
                                    border: 'none',
                                    background: confirmButtonStyle === 'danger' ? '#EF4444' : '#4318FF',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {confirmText}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
