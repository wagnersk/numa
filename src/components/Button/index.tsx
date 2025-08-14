import { 
    TouchableOpacity,
    TouchableOpacityProps,
    Text,
    ActivityIndicator
    } from 'react-native'

import { styles } from './styles'
import { colors, fontFamily } from '@/theme'

type Props = TouchableOpacityProps & {
    title?:string
    isProcessing?:boolean
    type?:'delete' 
}

export function Button({
    title, 
    isProcessing = false, 
    type,
    ...rest
}:Props){
    return(
        <TouchableOpacity 
        style={[styles.container, type === 'delete' && {backgroundColor:'transparent',borderWidth:2,borderColor:colors.red[400]}]}
        activeOpacity={0.8}
        disabled={isProcessing}
        {...rest}
         >
            <Text
             style={[styles.title, type === 'delete' && {color:colors.red[400], fontFamily: fontFamily.bold}]}
            >
                {isProcessing ? (
                    <ActivityIndicator size={'small'}
                    color={colors.white}
                    />
                ) : (
                    title
                )}
                </Text>

        </TouchableOpacity>
    )
}