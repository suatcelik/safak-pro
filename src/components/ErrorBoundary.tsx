import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/tokens';
import { StateView } from './ui/StateView';

interface State {
  error: Error | null;
}

/** Beklenmeyen render hatasında uygulamanın beyaz ekrana düşmesini engeller. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.warn('[ErrorBoundary]', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StateView
          kind="error"
          title="Bir şeyler ters gitti"
          message="Ekran açılamadı. Verilerin telefonunda duruyor; tekrar dene."
          actionLabel="Tekrar dene"
          onAction={() => this.setState({ error: null })}
        />
      </View>
    );
  }
}
