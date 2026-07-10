import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../theme';

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
}

export function Confetti({ count = 50 }: { count?: number }) {
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animationsRef = useRef<Animated.Value[]>([]);

  const colorsList = [colors.primary, colors.secondary, colors.success, colors.warning, colors.accent];

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    const animations: Animated.Value[] = [];
    
    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i.toString(),
        x: Math.random() * 300,
        y: -20,
        color: colorsList[Math.floor(Math.random() * colorsList.length)],
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 12,
      });
      animations.push(new Animated.Value(0));
    }

    piecesRef.current = pieces;
    animationsRef.current = animations;

    const animationsArr = animations.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 2000 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    Animated.parallel(animationsArr).start();
  }, [count]);

  return (
    <View style={styles.container} pointerEvents="none">
      {piecesRef.current.map((piece, i) => {
        const translateY = animationsRef.current[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 500],
        });
        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.piece,
              {
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                left: piece.x,
                transform: [
                  { translateY: translateY ?? 0 },
                  { rotate: `${piece.rotation}deg` },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  piece: { position: 'absolute', borderRadius: 2 },
});