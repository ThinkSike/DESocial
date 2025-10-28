import { useThemeColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { width?: number };

const ITEMS = [
  { id: '1', title: 'Binary Search Trees Discussion Sparks CS Interest', community: 'Computer Science Club', likes: 24, time: '2h ago' },
  { id: '2', title: 'Basketball Team Prepares for Championship Match', community: 'Basketball Team', likes: 45, time: '4h ago' },
  { id: '3', title: 'Music Society Announces Acoustic Night', community: 'Music Society', likes: 67, time: '6h ago' },
  { id: '4', title: 'AI Ethics Debate Draws Large Campus Crowd', community: 'Debate Society', likes: 32, time: '8h ago' },
];

export default function NewsSidebar({ width = 330 }: Props) {
  const colors = useThemeColors();
  const s = styles(colors, width);

  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Community Highlights</Text>
        <Text style={s.subtitle}>Trending from your communities</Text>

        <View style={s.list}>
          {ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={s.item} activeOpacity={0.85}>
              <Text numberOfLines={2} style={s.itemTitle}>{item.title}</Text>
              <Text style={s.meta}>
                {item.time} • {item.likes} likes • <Text style={s.community}>{item.community}</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.title}>Community Activities</Text>
        <TouchableOpacity style={s.activityRow} activeOpacity={0.85}>
          <Text style={s.activityTitle}>Code Challenge #49</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.activityRow} activeOpacity={0.85}>
          <Text style={s.activityTitle}>Photo Contest #196</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.activityRow} activeOpacity={0.85}>
          <Text style={s.activityTitle}>Music Quiz #357</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = (colors: any, width: number) =>
  StyleSheet.create({
    container: { width },
    card: {
      marginBottom: 16,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
    subtitle: { fontSize: 12, color: colors.textSecondary, marginBottom: 8 },
    list: { gap: 8 },
    item: {
      paddingVertical: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    itemTitle: { color: colors.text, fontSize: 13, lineHeight: 18 },
    meta: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
    community: { color: colors.primary },
    activityRow: {
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activityTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
    chevron: { color: colors.textSecondary, fontSize: 18, paddingHorizontal: 4 },
  });
