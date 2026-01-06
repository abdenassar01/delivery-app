import {
  Header,
  HeaderWithGoBack,
  RootWrapper,
  Text,
  TouchableOpacity,
} from '@/components';
import { TextTest } from '@/components/common/layout-helper/header/text-test';
import { useIsFirstTime } from '@/lib';
import { useSelectedLanguage } from '@/lib/i18n';
import { useAuthToken } from '@convex-dev/auth/react';
import { Link, Redirect } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const { setLanguage } = useSelectedLanguage();
  const { isFirstTime } = useIsFirstTime();
  const token = useAuthToken();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <RootWrapper className="">
      <Header />
      <Link href="/article" className="p-2">
        <Text>Article</Text>
      </Link>

      <Text className="bg-primary/10 p-2 text-backgroundSecondaryDark">
        {t('hallo')}
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis
        voluptas consequuntur, pariatur iure sed obcaecati nostrum ipsum! Dolore
        facilis vel expedita animi natus qui est deleniti exercitationem,
        voluptates quas autem?
      </Text>
      <TextTest />
    </RootWrapper>
  );
}
