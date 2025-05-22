import { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

export type ToastMessageRef = {
  show: (options?: Partial<ToastMessageProps>) => void;
};

type ToastMessageProps = {
  type: 'success' | 'danger' | 'info' | 'warning';
  text: string;
  description: string;
  timeout?: number;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const ToastMessage = forwardRef<ToastMessageRef, ToastMessageProps>(
  ({ type, text, description, timeout = 2000 }, ref) => {
    const [visible, setVisible] = useState(false);
    const [toastData, setToastData] = useState<ToastMessageProps>({
      type,
      text,
      description,
      timeout,
    });

    const translateY = useSharedValue(-120);
    const opacity = useSharedValue(0);

    const TOAST_TYPE = {
      success: {
        backgroundColor: '#2ecc71',
        icon: 'check-circle',
      },
      danger: {
        backgroundColor: '#e74c3c',
        icon: 'exclamation-circle',
      },
      info: {
        backgroundColor: '#3498db',
        icon: 'info-circle',
      },
      warning: {
        backgroundColor: '#f39c12',
        icon: 'exclamation-triangle',
      },
    };

    const showToast = (options?: Partial<ToastMessageProps>) => {
      const updated = {
        ...toastData,
        ...options,
      };
      setToastData(updated);
      setVisible(true);

      // Animate in
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      // Animate out after timeout
      setTimeout(() => {
        translateY.value = withTiming(-120, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        });
      }, updated.timeout ?? 2000);
    };

    useImperativeHandle(ref, () => ({
      show: showToast,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    const { backgroundColor, icon } = TOAST_TYPE[toastData.type];

    if (!visible) return null;

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            width: SCREEN_WIDTH,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor,
            zIndex: 999,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 10,
          },
          animatedStyle,
        ]}
      >
        <FontAwesome5 name={icon} size={22} color="#fff" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            {toastData.text}
          </Text>
          <Text style={{ fontSize: 14, color: '#fff' }}>
            {toastData.description}
          </Text>
        </View>
      </Animated.View>
    );
  }
);

export default ToastMessage;
