import React from "react";
import { Modal, Text, Button } from "@mantine/core";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, message, title }) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title={title}>
      <Text>{message}</Text>
      <Button onClick={onClose} mt="md">
        Close
      </Button>
    </Modal>
  );
};

export default NotificationModal;
