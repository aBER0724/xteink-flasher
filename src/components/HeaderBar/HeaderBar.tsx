'use client';

import React from 'react';
import {
  Box,
  Button,
  ClientOnly,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  Portal,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';
import { LuGithub, LuGlobe, LuSun } from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation, type Locale } from '@/i18n';

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

export default function HeaderBar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useTranslation();

  return (
    <Box bg="header-bar.bg" px={4}>
      <Container maxW="3xl">
        <Flex h={16} alignItems="center" gap={5}>
          <Heading size="md" color="header-bar.fg">
            <Link href="/">{t('header.title')}</Link>
          </Heading>
          <Flex h={16} alignItems="center" gap={2}>
            <Text textStyle="sm">
              <Link href="/">
                {pathname === '/' ? (
                  <b>{t('common.flash')}</b>
                ) : (
                  t('common.flash')
                )}
              </Link>
            </Text>
            <Text textStyle="sm">
              <Link href="/debug">
                {pathname === '/debug' ? (
                  <b>{t('common.debug')}</b>
                ) : (
                  t('common.debug')
                )}
              </Link>
            </Text>
          </Flex>
          <Spacer />

          <Flex alignItems="center" gap={2}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  css={{
                    _icon: {
                      width: '5',
                      height: '5',
                    },
                  }}
                >
                  <LuGlobe />
                  {LOCALE_OPTIONS.find((o) => o.value === locale)?.label}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {LOCALE_OPTIONS.map((option) => (
                      <Menu.Item
                        key={option.value}
                        value={option.value}
                        onClick={() => setLocale(option.value)}
                      >
                        {option.label}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
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
              aria-label={t('header.github')}
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
