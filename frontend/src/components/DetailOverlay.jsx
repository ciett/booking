import React from 'react';
import { Dialog, Button, Flex, Text } from '@radix-ui/themes';

const DetailOverlay = ({ trigger, title, description, content, footer }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Content maxWidth="650px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>

        <div className="py-4">
          {content}
        </div>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Đóng
            </Button>
          </Dialog.Close>
          {footer}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DetailOverlay;
