import React from 'react';
import { View } from 'react-native';
import { EmptyCalendar, ErrorCloud } from '../../assets/illustrations';
import { Button } from './Button';
import { Body, Heading } from './Typography';

interface Props {
  kind: 'empty' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** İllüstrasyonlu boş / hata görünümü */
export function StateView({ kind, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24 }}>
      {kind === 'empty' ? <EmptyCalendar /> : <ErrorCloud />}
      <View style={{ gap: 10, maxWidth: 300 }}>
        <Heading align="center">{title}</Heading>
        <Body color="textMuted" align="center">
          {message}
        </Body>
      </View>
      {actionLabel && onAction ? (
        <Button variant="primary" label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}
