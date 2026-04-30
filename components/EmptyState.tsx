import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { animations } from '../theme/animations';

const CIRCLE_SIZES = [110, 80, 50];
const CIRCLE_OPACITY = 0.3;
const GUIDE_TEXT = '说出你的数据分析需求\nAI 将为你即时洞察';

export function EmptyState() {
  const scales = CIRCLE_SIZES.map(() => useRef(new Animated.Value(animations.breathScaleMin)).current);
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathingAnimations = CIRCLE_SIZES.map((_, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * animations.breathStagger),
          Animated.timing(scales[index], {
            toValue: animations.breathScaleMax,
            duration: animations.durationBreath,
            useNativeDriver: true,
          }),
          Animated.timing(scales[index], {
            toValue: animations.breathScaleMin,
            duration: animations.durationBreath,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    const textAnimation = Animated.sequence([
      Animated.delay(600),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: animations.durationNormal,
        useNativeDriver: true,
      }),
    ]);

    Animated.parallel([...breathingAnimations, textAnimation]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circlesContainer}>
        {CIRCLE_SIZES.map((size, index) => (
          <Animated.View
            key={size}
            style={[
              styles.circleWrapper,
              {
                width: size,
                height: size,
                transform: [{ scale: scales[index] }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={[styles.circle, { width: size, height: size }]}
            />
          </Animated.View>
        ))}
      </View>
      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={styles.guideText}>{GUIDE_TEXT}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlesContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    borderRadius: 9999,
    opacity: CIRCLE_OPACITY,
  },
  textContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
