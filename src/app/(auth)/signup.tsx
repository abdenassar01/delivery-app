import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { HeaderWithGoBack, ProgressBar, RootWrapper, Text } from '@/components';

import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { SignupStepOne, SignupStepTwo } from '@/components';

export default function Signup() {
  const [step, setStep] = useState<number>(1);
  const getStepComponent = () => {
    switch (step) {
      case 1:
        return <SignupStepOne setStep={setStep} />;
      case 2:
        return <SignupStepTwo setStep={setStep} />;
      default:
        return null;
    }
  };
  return (
    <RootWrapper className="px-3">
      <KeyboardAvoidingView behavior="padding" className="">
        <ScrollView className="">
          <HeaderWithGoBack />
          <ProgressBar className="mt-3" steps={4} currentStep={step} />
          {getStepComponent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
