import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { animations } from '../theme/animations';

type ChatInputProps = {
  onSend: (message: string) => void;
};

const BORDER_UNFOCUSED = 'rgba(255,255,255,0.08)';
const BORDER_FOCUSED = 'rgba(96,165,250,0.6)';

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();

  // Breathing border animation (1500ms cycle) — active only when focused
  const borderAnim = useRef(new Animated.Value(0)).current;
  const glowOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      // Border: loop between unfocused (0) and focused (1)
      const borderLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: animations.durationBreath / 2,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: animations.durationBreath / 2,
            useNativeDriver: false,
          }),
        ]),
      );
      borderLoop.start();

      // Glow underline: opacity pulse (1200ms)
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacityAnim, {
            toValue: 1,
            duration: animations.durationPulse / 2,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacityAnim, {
            toValue: 0,
            duration: animations.durationPulse / 2,
            useNativeDriver: true,
          }),
        ]),
      );
      glowLoop.start();

      return () => {
        borderLoop.stop();
        glowLoop.stop();
        borderAnim.setValue(0);
        glowOpacityAnim.setValue(0);
      };
    } else {
      borderAnim.stopAnimation();
      glowOpacityAnim.stopAnimation();
      borderAnim.setValue(0);
      glowOpacityAnim.setValue(0);
    }
  }, [isFocused, borderAnim, glowOpacityAnim]);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
    Keyboard.dismiss();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BORDER_UNFOCUSED, BORDER_FOCUSED],
  });

  const canSend = value.trim().length > 0;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {/* Input row */}
      <Animated.View
        style={[
          styles.inputRow,
          { borderColor: isFocused ? borderColor : BORDER_UNFOCUSED },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="输入你的数据分析需求..."
          placeholderTextColor={colors.inputPlaceholder}
          multiline
          maxLength={500}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <Feather name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Glow underline */}
      <Animated.View
        style={[
          styles.glowUnderline,
          {
            opacity: glowOpacityAnim,
            backgroundColor: colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.inputBg,
    borderRadius: 22,
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.userBubbleTo,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(96,165,250,0.2)',
  },
  glowUnderline: {
    height: 2,
    borderRadius: 1,
    marginTop: 4,
    marginHorizontal: 2,
  },
});
