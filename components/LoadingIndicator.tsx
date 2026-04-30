import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPhaseLabel, type LoadingPhase } from '../types/chat';
import { colors } from '../theme/colors';
import { animations } from '../theme/animations';

type LoadingIndicatorProps = {
  phase?: LoadingPhase;
};

export function LoadingIndicator({ phase }: LoadingIndicatorProps) {
  const label = getPhaseLabel(phase);

  // Progress bar fill: cycles 0% -> 100% -> 10% in a loop
  const progressAnim = useRef(new Animated.Value(0)).current;
  // Pulse dot opacity
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  // Wave bar heights
  const waveAnims = useRef(
    Array.from({ length: animations.waveBarCount }, () => new Animated.Value(animations.waveBarMinHeight)),
  ).current;

  useEffect(() => {
    // Progress cycling: 0% -> 100% then reset to 10%, loop
    const cycleProgress = () => {
      progressAnim.setValue(0);
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: animations.durationPulse,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          progressAnim.setValue(10);
          cycleProgress();
        }
      });
    };
    cycleProgress();

    // Pulse dot
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: animations.durationPulse / 2,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: animations.durationPulse / 2,
          useNativeDriver: false,
        }),
      ]),
    );
    pulseLoop.start();

    // Wave bars: each bar animates to a random height independently
    const waveLoops = waveAnims.map((anim) => {
      const randomize = () => {
        const randomHeight =
          animations.waveBarMinHeight +
          Math.random() * (animations.waveBarMaxHeight - animations.waveBarMinHeight);
        Animated.timing(anim, {
          toValue: randomHeight,
          duration: 300 + Math.random() * 400,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) randomize();
        });
      };
      randomize();
      return anim;
    });

    return () => {
      progressAnim.stopAnimation();
      pulseAnim.stopAnimation();
      waveLoops.forEach((a) => a.stopAnimation());
    };
  }, [progressAnim, pulseAnim, waveAnims]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Progress bar row */}
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFillWrapper, { width: progressWidth }]}>
            <LinearGradient
              colors={['#60A5FA', '#818CF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
          </Animated.View>
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
        </View>

        {/* Wave spectrum */}
        <View style={styles.waveContainer}>
          {waveAnims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: anim,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Phase label */}
      {label ? (
        <View style={styles.labelRow}>
          <View style={styles.labelDot} />
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    width: animations.progressWidth,
    height: animations.progressHeight,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 1.5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFillWrapper: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressFill: {
    flex: 1,
    height: '100%',
    borderRadius: 1.5,
  },
  pulseDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    top: -2.5,
    right: -4,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.primary,
    opacity: 0.5,
    borderRadius: 1.5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  labelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
