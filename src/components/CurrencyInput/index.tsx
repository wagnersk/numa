import { Text, View } from 'react-native'
import { styles } from './styles'
import { colors } from '@/theme'
import Input, { CurrencyInputProps } from 'react-native-currency-input'

type Props = CurrencyInputProps & {
  label: string
  fontSize?:number
  height?:number
  borderRadius?:number
  borderWidth?:number


}

export function CurrencyInput({ 
  label,
  fontSize=16,
  height, 
  borderRadius,
  borderWidth,
  ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label,fontSize && {fontSize:fontSize}]}>{label}</Text>

      <Input
        style={
          [styles.input,
            borderRadius && {borderRadius:borderRadius},
            height && {height:height},
            borderWidth && {borderWidth:borderWidth}
          ]
        }
        placeholderTextColor={colors.gray[400]}
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        
        {...rest}
      />
    </View>
  )
}