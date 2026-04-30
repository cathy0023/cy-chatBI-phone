export const animations = {
  // 时长（ms）
  durationFast: 250,
  durationNormal: 300,
  durationSlow: 500,
  durationBreath: 1500,
  durationPulse: 1200,

  // 缓动
  easingDefault: 'ease-out' as const,

  // 消息入场
  messageSlideDistance: 20,
  messageScaleFrom: 0.9,

  // 空状态呼吸
  breathScaleMin: 0.7,
  breathScaleMax: 1.1,
  breathStagger: 300,

  // 进度条
  progressWidth: 120,
  progressHeight: 3,

  // 波形图
  waveBarCount: 5,
  waveBarMinHeight: 4,
  waveBarMaxHeight: 16,
};