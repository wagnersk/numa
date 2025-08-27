import { StyleSheet} from 'react-native'

import { colors,fontFamily} from '@/theme'

export const styles = StyleSheet.create({
    container:{
     backgroundColor: colors.gray[700],
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: "center",
        marginTop: 20,
      paddingHorizontal: 16,
    },
    title:{
       color: colors.black,
        fontSize: 16,
        fontFamily: fontFamily.bold,
    }
})