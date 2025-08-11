
import { colors, fontFamily } from '@/theme'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    
  },
  label: {
    color: colors.gray[600],
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  input: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.white,
  },
})

       