import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModal, useBottomSheet } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type ModalProps = BottomSheetModalProps & {
  title?: string;
};

type ModalRef = React.ForwardedRef<BottomSheetModal>;

export const useModal = () => {
  const ref = React.useRef<BottomSheetModal>(null);
  const present = React.useCallback((data?: any) => {
    ref.current?.present(data);
  }, []);
  const dismiss = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);
  return { ref, present, dismiss };
};

export const Modal = React.forwardRef(
  (
    {
      snapPoints: _snapPoints = ['60%'],
      detached = false,
      ...props
    }: ModalProps,
    ref: ModalRef,
  ) => {
    const detachedProps = React.useMemo(
      () => getDetachedProps(detached),
      [detached],
    );
    const modal = useModal();
    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints]);

    React.useImperativeHandle(
      ref,
      () => (modal.ref.current as BottomSheetModal) || null,
    );

    const renderHandleComponent = React.useCallback(
      () => (
        <>
          <ModalHeader />
        </>
      ),
      [],
    );

    return (
      <BottomSheetModal
        {...props}
        {...detachedProps}
        ref={modal.ref}
        index={0}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        snapPoints={snapPoints}
        backgroundComponent={({ style }) => (
          <ScrollView
            className="bg-background pb-5"
            style={[style, { borderRadius: 36 }]}
          />
        )}
        backdropComponent={props.backdropComponent || renderBackdrop}
        enableDynamicSizing={false}
        handleComponent={renderHandleComponent}
      />
    );
  },
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomBackdrop = ({ style }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet();
  return (
    <AnimatedPressable
      onPress={() => close()}
      entering={FadeIn.duration(50)}
      exiting={FadeOut.duration(20)}
      style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}
    />
  );
};

export const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <CustomBackdrop {...props} />
);

const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>;
  }
  return {} as Partial<BottomSheetModalProps>;
};

const ModalHeader = React.memo(() => {
  return (
    <View className="border-primary/40 mx-2 h-6 items-center justify-center border-b">
      <View className="bg-primary/20 h-1.5 w-20 rounded-full" />
    </View>
  );
});
