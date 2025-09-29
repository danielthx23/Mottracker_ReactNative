import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const PingCircle = ({
  cx,
  cy,
  color = '#10b981',
  maxRadius = 25,
}: {
  cx: number;
  cy: number;
  color?: string;
  maxRadius?: number;
}) => {
  const radius = useState(new Animated.Value(0))[0];
  const opacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const animate = () => {
      radius.setValue(0);
      opacity.setValue(1);
      Animated.parallel([
        Animated.timing(radius, {
          toValue: maxRadius,
          duration: 1500,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={radius}
      stroke={color}
      strokeWidth={2}
      fill="none"
      opacity={opacity}
    />
  );
};

export default PingCircle;
