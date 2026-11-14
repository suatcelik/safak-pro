import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { Check, Search, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CITY_NAMES_SORTED } from '../../domain/cities';
import { colors, fonts, radius } from '../../theme/tokens';
import { Heading, IconButton, Typo } from '../ui';

interface Props {
  visible: boolean;
  title: string;
  value: string;
  onSelect: (city: string) => void;
  onClose: () => void;
}

/** Alttan açılan aranabilir il listesi */
export function CityPicker({ visible, title, value, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('tr');
    return CITY_NAMES_SORTED.filter((c) => c.toLocaleLowerCase('tr').includes(q));
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          style={{
            height: '85%',
            backgroundColor: colors.bg,
            borderTopLeftRadius: radius.card,
            borderTopRightRadius: radius.card,
            paddingTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 24,
            }}
          >
            <Heading level={2}>{title}</Heading>
            <IconButton label="Kapat" onPress={onClose} size={44}>
              <X size={20} color={colors.text} />
            </IconButton>
          </View>
          <View
            style={{
              margin: 24,
              marginBottom: 12,
              height: 52,
              borderRadius: radius.cardSm,
              backgroundColor: colors.surface,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              gap: 10,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="İl ara"
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              accessibilityLabel="İl ara"
              style={{ flex: 1, color: colors.text, fontFamily: fonts.semibold, fontSize: 16 }}
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(c) => c}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setQuery('');
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => ({
                    minHeight: 56,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: pressed ? colors.surface : 'transparent',
                  })}
                >
                  <Typo variant="bodyStrong" color={selected ? 'accent' : 'text'} size={17}>
                    {item}
                  </Typo>
                  {selected ? <Check size={20} color={colors.accent} strokeWidth={3} /> : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Typo variant="body" color="textMuted" align="center" style={{ padding: 24 }}>
                İl bulunamadı.
              </Typo>
            }
          />
        </View>
      </View>
    </Modal>
  );
}
