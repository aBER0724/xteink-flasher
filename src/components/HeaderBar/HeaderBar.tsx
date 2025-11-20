'use client';

import React from 'react';
import {
  Box,
  ClientOnly,
  Container,
  Flex,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { LuGithub, LuSun } from 'react-icons/lu';

export default function HeaderBar() {
  return (
    <Box bg="header-bar.bg" px={4}>
      <Container maxW="3xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Heading size="md" color="header-bar.fg">
            Xteink Flash Tools
          </Heading>

          <Flex alignItems="center" gap={2}>
            <IconButton
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(
                  'https://github.com/daveallie/xteink-flasher',
                  '_blank',
                )
              }
              css={{
                _icon: {
                  width: '5',
                  height: '5',
                },
              }}
              aria-label="Go to Github repo"
            >
              <LuGithub />
            </IconButton>
            <ClientOnly
              fallback={
                <IconButton
                  size="sm"
                  variant="outline"
                  css={{
                    _icon: {
                      width: '5',
                      height: '5',
                    },
                  }}
                >
                  <LuSun />
                </IconButton>
              }
            >
              <ColorModeButton variant="outline" />
            </ClientOnly>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
