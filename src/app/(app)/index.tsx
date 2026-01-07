import React from 'react';

import { HomeTopSection, RootWrapper } from '@/components';

export default function HomeScreen() {
  return (
    <RootWrapper className="and:pt-0 ios:pt-0 pt-0!">
      <HomeTopSection />
    </RootWrapper>
  );
}
