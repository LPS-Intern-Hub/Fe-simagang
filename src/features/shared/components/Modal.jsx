import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose, type = 'success', title, message, buttonText = 'Tutup', customImage }) => {
    // Backdrop animation
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    // Modal content animation with spring
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

    // Children animation (icon, title, message, button)
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
                    >
                        <motion.div className={styles.modalIcon} variants={itemVariants}>
                            {customImage ? (
                                <motion.img
                                    src={customImage}
                                    alt="modal icon"
                                    className={styles.iconImage}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        damping: 15,
                                        stiffness: 200,
                                        delay: 0.3
                                    }}
                                />
                            ) : type === 'success' ? (
                                <motion.img
                                    src="/images/sukses.png"
                                    alt="success"
                                    className={styles.iconImage}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        damping: 15,
                                        stiffness: 200,
                                        delay: 0.3
                                    }}
                                />
                            ) : (
                                <motion.div
                                    className={styles.errorIconWrapper}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        damping: 15,
                                        stiffness: 200,
                                        delay: 0.3
                                    }}
                                >
                                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="60" cy="60" r="55" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                                        <circle cx="60" cy="60" r="45" fill="#EF4444" />
                                        <path d="M45 45L75 75M75 45L45 75" stroke="white" strokeWidth="6" strokeLinecap="round" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.h2 className={styles.modalTitle} variants={itemVariants}>
                            {title}
                        </motion.h2>

                        {message && (
                            <motion.p className={styles.modalMessage} variants={itemVariants}>
                                {message}
                            </motion.p>
                        )}

                        <motion.button
                            className={styles.modalButton}
                            onClick={onClose}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {buttonText}
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
