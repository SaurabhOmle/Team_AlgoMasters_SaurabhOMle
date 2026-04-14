import { motion } from 'framer-motion';

interface AnimatedAvatarProps {
  isListening?: boolean;
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedAvatar({ isListening = false, isThinking = false, size = 'lg' }: AnimatedAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const ringSizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      <div className={`absolute ${ringSizeClasses[size]} rounded-full`}>
        <div className={`absolute inset-0 rounded-full border-2 ${
          isListening ? 'border-red-400/40' : 'border-primary/30'
        } avatar-ring`} />
        <div className={`absolute inset-0 rounded-full border-2 ${
          isListening ? 'border-red-400/30' : 'border-primary/20'
        } avatar-ring avatar-ring-delay-1`} />
        <div className={`absolute inset-0 rounded-full border-2 ${
          isListening ? 'border-red-400/20' : 'border-primary/10'
        } avatar-ring avatar-ring-delay-2`} />
      </div>

      {/* Main avatar circle */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative ${
          isListening 
            ? 'bg-gradient-to-br from-red-500 to-red-700 recording-pulse' 
            : isThinking
            ? 'bg-gradient-to-br from-accent to-yellow-600'
            : 'bg-gradient-to-br from-primary to-primary-dark'
        } ${!isListening && !isThinking ? 'avatar-breathe' : ''}`}
        animate={isThinking ? { scale: [1, 1.1, 1] } : {}}
        transition={isThinking ? { duration: 0.8, repeat: Infinity } : {}}
      >
        {/* Inner glow */}
        <div className={`absolute inset-1 rounded-full ${
          isListening 
            ? 'bg-gradient-to-br from-red-400/20 to-transparent' 
            : isThinking
            ? 'bg-gradient-to-br from-yellow-300/20 to-transparent'
            : 'bg-gradient-to-br from-primary-light/20 to-transparent'
        }`} />

        {/* Face / Icon */}
        {isListening ? (
          // Listening animation - sound wave bars
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: isListening ? [8, 20, 8, 16, 8][i] : 8,
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        ) : isThinking ? (
          // Thinking animation - dots
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        ) : (
          // Default - medical cross / heart
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            <path d="M12 8v8M8 12h8" strokeWidth="1.5" opacity="0.5" />
          </svg>
        )}
      </motion.div>

      {/* Floating particles */}
      {!isListening && !isThinking && size === 'lg' && (
        <>
          {[
            { x: -40, y: -30, delay: 0, size: 4 },
            { x: 45, y: -20, delay: 0.5, size: 3 },
            { x: -35, y: 35, delay: 1, size: 5 },
            { x: 40, y: 30, delay: 1.5, size: 3 },
            { x: 0, y: -45, delay: 0.8, size: 4 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/30"
              style={{ width: p.size, height: p.size }}
              animate={{
                x: [0, p.x, 0],
                y: [0, p.y, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
